import { NextRequest, NextResponse } from "next/server";
import { saveCheck, getIpCheckCountToday, isEmailRegistered, CheckResult } from "@/lib/storage";
import { getSystemPrompt, getUserMessage } from "@/lib/prompt-templates";

export async function POST(req: NextRequest) {
  try {
    // 1. Get Client IP for Rate Limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";

    const checkCount = getIpCheckCountToday(ip);
    const hasEmail = isEmailRegistered(ip);
    const limit = hasEmail ? 5 : 3;

    if (checkCount >= limit) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: hasEmail 
            ? "You have used all 5 free checks for today. Upgrade to Pro for unlimited checks!"
            : "You have used your 3 free checks for today. Enter your email to get 2 bonus checks!",
          emailRequired: !hasEmail,
          checksUsed: checkCount,
          limit
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { text, contentType, brandProfile } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "missing_text", message: "Copy text cannot be empty." },
        { status: 400 }
      );
    }
    if (!contentType || !contentType.trim()) {
      return NextResponse.json(
        { error: "missing_content_type", message: "Content type must be specified." },
        { status: 400 }
      );
    }

    // 3. Construct system & user prompts
    const systemPrompt = getSystemPrompt(brandProfile);
    const userMessage = getUserMessage(contentType, text);

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "server_error", message: "AI provider not configured." },
        { status: 500 }
      );
    }

    // 4. Call OpenRouter using native fetch
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API error:", errText);
      return NextResponse.json(
        { error: "ai_error", message: "Failed to communicate with AI model." },
        { status: 502 }
      );
    }

    const responseData = await response.json();
    const rawContent = responseData.choices?.[0]?.message?.content?.trim();
    if (!rawContent) {
      return NextResponse.json(
        { error: "ai_error", message: "Empty response from AI model." },
        { status: 502 }
      );
    }

    // 5. Parse output JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", rawContent, parseError);
      return NextResponse.json(
        { error: "ai_error", message: "AI response did not return valid JSON." },
        { status: 502 }
      );
    }

    // 6. Check for Moderation Refusal
    if (parsedResult.error === "moderation_failed") {
      return NextResponse.json(
        {
          error: "moderation_failed",
          message: parsedResult.message || "This copy contains content that fails our brand safety standards."
        },
        { status: 400 }
      );
    }

    // 7. Validate required fields
    const { score, verdict_band, verdict_label, issues, rewrite_fix, rewrite_genz } = parsedResult;
    if (score === undefined || !verdict_band || !verdict_label || !issues || !rewrite_fix || !rewrite_genz) {
      console.error("Invalid response fields from AI model:", parsedResult);
      return NextResponse.json(
        { error: "ai_error", message: "AI response did not match expected schema." },
        { status: 502 }
      );
    }

    // 8. Save Check Result
    const checkId = Math.random().toString(36).substring(2, 15);
    const newCheck: CheckResult = {
      id: checkId,
      timestamp: new Date().toISOString(),
      contentType,
      originalText: text,
      score,
      verdict_band,
      verdict_label,
      issues,
      rewrite_fix,
      rewrite_genz,
      ip,
      brandProfileUsed: !!(brandProfile && (brandProfile.rules?.trim() || brandProfile.posts?.some((p: string) => p.trim())))
    };

    saveCheck(newCheck);

    return NextResponse.json({
      success: true,
      check: newCheck,
      checksUsed: checkCount + 1,
      limit
    });

  } catch (error: any) {
    console.error("Error in /api/check route:", error);
    return NextResponse.json(
      { error: "server_error", message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
