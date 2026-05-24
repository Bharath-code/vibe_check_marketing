  
**AI VIBE CHECK**

Product Requirements Document

| *Does your brand content pass the Gen Z test?* AI-powered content analysis and rewriting for brands marketing to 18–26 year olds |
| :---: |

| Version | 1.0 — Initial Release |
| :---- | :---- |
| **Author** | Bharath |
| **Date** | May 2026 |
| **Status** | Approved for development |
| **Target launch** | 14 days from project start |

# **1\. Product overview**

## **1.1 Problem statement**

Indian brands targeting Gen Z (18–26 year olds) consistently publish content that misses the mark — corporate language, hard-sell tactics, and tonal mismatches that cause younger audiences to scroll past instantly. Content teams have no fast, reliable way to gut-check their copy before publishing.

| The core pain *A content manager at an Indian D2C brand spends 30 minutes writing a tweet. It goes live. It gets 3 likes. They have no idea why it failed, and no time to find out. This happens 5–10 times per week across every brand marketing to young consumers.* |
| :---- |

## **1.2 Solution**

AI Vibe Check is a web-based tool that analyzes any piece of brand content (tweet, TikTok script, LinkedIn post, ad copy, product description) and returns:

* A 0–100 Gen Z approval score with a plain-English verdict

* 3–5 specific issues calling out exact phrases and why they fail

* A rewritten version in authentic Gen Z voice

* A shareable result card for social distribution

## **1.3 Strategic positioning**

Framing: A fast, honest second opinion from an AI that grew up on the internet — not a scientific measurement tool. This framing is accurate, defensible, and sets correct expectations.

Primary market: Indian B2B brand and marketing teams ($19–39/mo).

Secondary market: Individual creators and students (free tier, viral acquisition engine).

Competitive gap: No direct competitor owns this positioning, especially in the Indian market.

## **1.4 Key scores at a glance**

| Dimension | Score | Rationale |
| :---- | :---: | :---- |
| **Build ease** | **9/10** | *Claude API \+ Next.js \+ Cloudflare. No new tools. Pure text I/O. \~5 day MVP.* |
| **Monetise ease** | **8/10** | *B2B subscription at $19/mo. 50 customers \= \~₹9.6L ARR. Reachable solo.* |
| **Viral potential** | **7/10** | *Shareable result cards drive organic acquisition. B2C free tier is the loop.* |
| **Genuine value** | **8/10** | *Removes obvious cringe and rewrites in useful register. 70–75% accuracy for stated purpose.* |
| **Gen Z fit** | **7/10** | *Product is for brands targeting Gen Z, not Gen Z directly. ICP clarity needed.* |

# **2\. Target audience**

## **2.1 Primary ICP — Brand and marketing teams (pays)**

| Ideal customer profile Role: Content manager, social media executive, or founder at a brand Company: Indian D2C, EdTech, fintech, or FMCG brand actively targeting 18–26 year olds Size: 5–200 person team. Has a dedicated content person but no Gen Z research budget. Volume: Publishes 20–50 pieces of content per week across platforms Pain: No fast way to check if copy lands with younger audience before publishing |
| :---- |

Example companies (reachable via LinkedIn outreach):

* Mamaearth, mCaffeine, Minimalist — D2C beauty brands targeting Gen Z women

* upGrad, Physics Wallah, Unacademy — EdTech brands marketing to college-age students

* CoinSwitch, Groww, Fi Money — fintech apps with young-first positioning

* Zepto, Blinkit, Swiggy Instamart — quick commerce with high Gen Z usage

* Boat, Noise, Fire-Boltt — consumer electronics brands with Gen Z as primary buyer

## **2.2 Secondary audience — Individual creators (acquires, doesn’t pay initially)**

18–26 year old content creators, students, and indie professionals who want to know if their personal content (LinkedIn posts, Twitter threads, college presentations) sounds authentic. They use the free tier, share results virally, and occasionally convert to paid when they monetise their own audience.

Acquisition value: Each shared result card is a free ad. This audience is the growth engine, not the revenue engine.

# **3\. User stories**

## **3.1 Primary user stories**

| As a... | I want to... | So that... |
| :---- | :---- | :---- |
| Content manager at a D2C brand | paste a tweet draft and get instant feedback on whether it sounds Gen Z-native | I can fix cringe copy before it goes live and embarrasses the brand |
| Social media executive | get a Gen Z-native rewrite of our ad copy | I can present a better version to my team without doing it manually |
| Startup founder | check if our product page copy lands with younger users | we’re launching to a Gen Z audience and I can’t afford to miss the tone |
| Student content creator | see if my LinkedIn post sounds cringe before I post it | I’m building my personal brand and don’t want to sound like a boomer |
| Marketing agency | run client content through a vibe check before delivering | it adds a quality signal to our deliverables without extra research cost |

# **4\. Features and requirements**

## **4.1 Feature prioritisation**

P0 \= must have for launch. P1 \= must have within 2 weeks of launch. P2 \= nice to have in month 2\.

| Feature | Priority | Phase | Notes |
| :---- | ----- | ----- | :---- |
| **Text input with content type selector** | **P0** | Day 2 | *Tweet / LinkedIn / TikTok script / ad copy / custom* |
| **Gen Z score (0–100) with verdict label** | **P0** | Day 2 | *Plain-English verdict, not just a number. e.g. 'Hard cringe'* |
| **Specific issues list (3–5 bullets)** | **P0** | Day 2 | *Must quote exact words from the original, not generic advice* |
| **Gen Z rewrite** | **P0** | Day 2 | *One-click copy button. This is the highest-value output.* |
| **Shareable result card** | **P0** | Day 3 | *OG image generated for social sharing. Score \+ verdict visible.* |
| **IP-based rate limiting (3 free/day)** | **P0** | Day 4 | *Upstash Redis. Soft limit with email capture, not hard block.* |
| **Email capture before paywall** | **P0** | Day 4 | *Collect email before showing upgrade prompt. Feeds list.* |
| **Landing page with live demo embed** | **P0** | Day 5 | *3 before/after examples from real Indian brand tweets.* |
| **Stripe subscription ($19/mo)** | **P1** | Day 11 | *One plan only at launch. Unlimited checks \+ team sharing.* |
| **User dashboard (check history)** | **P1** | Day 12 | *Brand teams need to review and share past checks.* |
| **Team workspace (share checks)** | **P1** | Day 13 | *Invite team members. Required for $39/mo team plan.* |
| **Content type analytics** | **P2** | Month 2 | *Which content types score worst. Useful for brand reports.* |
| **Bulk CSV input** | **P2** | Month 2 | *Upload 50 pieces of content, get all scored at once.* |
| **Slack / Notion integration** | **P2** | Month 3 | *For teams already living in these tools.* |

## **4.2 Core user flow**

The complete flow a brand user experiences, from landing to sharing:

| User lands on vibecheck.in and sees 3 before/after examples immediately (no login wall) Pastes their own content into the input box, selects content type, clicks Run vibe check Result appears: score circle, verdict, issues list, rewrite. All visible without scrolling on desktop. User copies the rewrite or shares the result card. Sharing generates a unique URL. After 3 checks in a day, email capture prompt appears: Enter your email for 2 bonus checks today After email capture, upgrade prompt: Unlimited checks for your team at $19/mo |

# **5\. Technical architecture**

## **5.1 Tech stack**

| Layer | Technology | Rationale |
| :---- | :---- | :---- |
| Framework | Next.js 14 (App Router) + **Vercel AI SDK** | Bharath already uses it. Vercel AI SDK provides provider-agnostic model routing and native structured JSON schema validation. |
| Runtime | Bun | Faster installs and dev server. Compatible with Next.js. |
| Hosting | Cloudflare Pages | Free tier, global CDN, edge functions for rate limiting. |
| AI Model | **DeepSeek-V3 (`deepseek-chat`)** | Default model. Matches GPT-4o / Claude 3.5 Sonnet text quality at 21x-53x lower cost. |
| Fallback Model | **Llama 3.3 70B via Groq** | Secondary model for sub-300ms latency and high-speed execution pings. |
| Rate limiting | Upstash Redis | Serverless, no infra, pay-per-request. IP-based daily limits. |
| Payments | Stripe Checkout | Self-serve billing. Works in India for USD subscriptions. |
| Email | Resend | Simple API. Free tier for first 3,000 emails/mo. |
| Auth (P1) | Clerk or NextAuth | Only needed when team dashboard ships. Skip for MVP. |
| Storage (P1) | Convex or Cloudflare KV | Check history for team plans. Not needed on day 1\. |

## **5.2 Prompt architecture**

The prompt is the core IP of the product. It must be engineered carefully and iterated on before UI work begins.

| System prompt (send once per session) *You are a 22-year-old Gen Z content strategist who grew up on TikTok, Twitter, and Instagram. You review brand content and give brutally honest, specific feedback. You hate corporate speak, hard sells, and anything that sounds like it was written by someone who learned about Gen Z from a marketing report. You care about authenticity, wit, and voice. You always quote specific phrases from the original when explaining problems.* User message template *Review this \[CONTENT\_TYPE\]: \[USER\_TEXT\]. Return a JSON object with: score (0-100 integer), verdict (max 8 words, no punctuation), issues (array of 3-5 strings each quoting a specific phrase and explaining why it fails), rewrite (rewritten version in authentic Gen Z voice, same length as original). Return JSON only, no preamble.* Critical constraints • Temperature: 0.7 — enough variation for personality, not enough for hallucination • Max tokens: 800 — keeps response fast and cost low • Parse JSON strictly — wrap in try/catch, strip markdown fences if present • Do not show a raw score as scientific truth in UI — always pair with the plain-English verdict |
| :---- |

## **5.3 Cost model**

At DeepSeek-V3 pricing (~$0.14/M input tokens, ~$0.28/M output tokens), a typical check costs approximately $0.0001–0.0002 per request. This means:

* 1,000 free checks per day costs ~$0.10–0.15 in API fees

* A $19/mo subscriber doing 20 checks/day costs ~$0.06–0.09/mo in API fees

* Gross margin on paid subscribers is approximately 99.5%

* Note: Avoid reasoning models like DeepSeek-R1 for this task, as the generation of thinking tokens significantly increases latency (10s+) and billing overhead.

Cost is not a risk at current scale. Monitor monthly and set a $50 API spend alert.


# **6\. Revenue model**

## **6.1 Pricing tiers**

|  | Free | Pro — $19/mo |
| ----- | ----- | ----- |
| **Checks per day** | 3 | Unlimited |
| **Score \+ verdict** | Yes | Yes |
| **Issues list** | Yes | Yes |
| **Gen Z rewrite** | Yes | Yes |
| **Shareable card** | Yes | Yes |
| **Check history** | No | Last 30 days |
| **Team sharing** | No | Up to 5 seats |
| **Bulk CSV input** | No | Yes (month 2\) |
| **Priority support** | No | Yes |

Note: Team plan at $39/mo (up to 10 seats) to be introduced in month 2 once single-user demand is proven. Do not build it before then.

## **6.2 Revenue projections**

| Customers | Price/mo | MRR | ARR (USD) | ARR (INR) |
| :---: | :---: | :---: | :---: | :---: |
| 10 | $19 | $190 | $2,280 | \~₹1.9L |
| 25 | $19 | $475 | $5,700 | \~₹4.8L |
| **50 ← target** | **$19** | **$950** | **$11,400** | **\~₹9.6L** |
| 100 | $19 | $1,900 | $22,800 | \~₹19.2L |
| 50 | $39 | $1,950 | $23,400 | \~₹19.7L |

Target: 50 Pro subscribers within 90 days of launch. That is \~₹9.6L ARR — a meaningful first milestone for a solo product.

| $950 Target MRR (day 90\) | $11,400 Target ARR | ₹9.6L INR equivalent | 50 Customers needed |
| :---: | :---: | :---: | :---: |

# **7\. Go-to-market strategy**

## **7.1 Week 1 — build and soft launch**

* Ship working v1 (input → score → rewrite → share) in 5 days

* Share in 2–3 communities already joined: IndieHackers, relevant WhatsApp/Slack groups

* Post on Twitter/X with a real before/after example from an Indian brand tweet

* Goal: 50 signups, 10 people who use it without being asked

## **7.2 Week 2 — first 10 brand customers**

* Identify 10 content managers at target brands on LinkedIn

* Send 10 personalised DMs: one sentence problem, one link, one ask for feedback (not a sale)

* Offer first 10 paying customers 3 months at $9/mo — early adopter pricing

* Get on a 15-minute call or async Loom review with anyone who responds

* Goal: 3 paying customers by end of week 2

## **7.3 Month 1–3 — compound**

* Every new style drop (e.g. adding YouTube Shorts script as a content type) is a launch moment

* Write one case study per paying customer: what they pasted, what changed, what the brand did

* Post weekly on Twitter/X: one real brand before/after per week (with permission or anonymised)

* SEO target: ‘how to write for Gen Z’, ‘Gen Z marketing tips India’ — long-tail, low competition

* When 10 paying customers reached: introduce annual plan at 2 months free ($190/yr)

## **7.4 Distribution loop**

| The self-reinforcing acquisition loop 1\. Free user pastes content and gets a score 2\. They share the result card on Twitter/LinkedIn with 'my brand copy scored 18/100 lol' 3\. Followers click the shared link and try it on their own content 4\. Brand team member finds it useful, shares with their content manager 5\. Content manager converts to Pro — the result card generated the B2B lead |
| :---- |

# **8\. Success metrics**

## **8.1 Launch metrics (day 1–14)**

| 50+ Signups | 10+ Active checkers | 20+ Shares | 1+ Paying customers |
| :---: | :---: | :---: | :---: |

## **8.2 Month 1 metrics**

| $190+ MRR | 200+ Email list | 1,000+ Checks run | 30%+ Retention (D7) |
| :---: | :---: | :---: | :---: |

## **8.3 Month 3 target (the real milestone)**

| $950 MRR | 50 Paying brands | ₹9.6L ARR (INR) | \<5% Churn/mo |
| :---: | :---: | :---: | :---: |

## **8.4 North star metric**

| Number of brand teams running a check every week *This measures whether the tool has become a habit, not just a novelty. Weekly active brand teams is the leading indicator of low churn and high LTV.* |
| :---: |

# **9\. Risks and mitigations**

| Risk | Likelihood | Impact | Mitigation |
| :---- | ----- | ----- | :---- |
| **Accuracy is questioned by users** | **High** | **High** | *Reframe as perspective, not science. Lead with rewrite quality over score. Add 'How we score this' tooltip.* |
| **Low B2B conversion from free users** | **Med** | **High** | *Targeted LinkedIn outreach to 10 brands in week 2\. Don’t wait for inbound at launch.* |
| **High API cost from viral spike** | **Low** | **Med** | *Set $50/day spend cap on Anthropic API. Rate limit aggressively. Upgrade prompt on cap hit.* |
| **Competitor builds same thing fast** | **Med** | **Med** | *First-mover \+ Indian market focus \+ brand relationships are the moat. Speed to 50 customers matters more than features.* |
| **Prompt produces harmful rewrites** | **Low** | **High** | *Add content moderation layer. Explicitly instruct Claude to refuse to rewrite hate speech, political content, or personal attacks.* |
| **Context-switch to another product** | **High** | **High** | *Commit to this product for 90 days regardless of new ideas. Write this commitment down. Track it weekly.* |

# **10\. 14-day build plan**

## **Phase 1 — Build (days 1–5)**

| Day | Focus | Done when... |
| :---- | :---- | :---- |
| **Day 1** | Project setup \+ prompt | Claude prompt tested manually on 10 real brand tweets. Skeleton deployed to Cloudflare Pages. |
| **Day 2** | Core UI | Text in, result out. Score, issues, rewrite all rendering. API route live. No auth, no Stripe. |
| **Day 3** | Share card | Shareable URL with OG image. Shared link shows result. Try it yourself CTA present. |
| **Day 4** | Rate limit \+ email capture | 3 free checks/day working. Email collected before paywall. Emails going to Resend list. |
| **Day 5** | Landing page \+ deploy | Live on custom domain. 3 before/after examples using real Indian brand copy. Shared in 3 communities. |

## **Phase 2 — Validate (days 6–10)**

* Days 6–7: Find 10 brand content managers on LinkedIn. Send DMs. Observe real usage via Loom or call.

* Days 8–9: Fix the top 3 UI friction points. Improve prompt based on real input types observed.

* Day 10: Decision checkpoint. Green (continue) if 5+ real users, 2+ said they’d pay. Red (pivot) if nobody found the rewrite useful.

## **Phase 3 — Monetise (days 11–14)**

* Days 11–12: Add Stripe Checkout. One plan ($19/mo). Test full free → upgrade → cancel flow.

* Days 13–14: Email list with launch announcement. Offer first 10 subscribers 3 months at $9/mo. First paying customer \= milestone.

# **11\. Open questions**

These are unresolved decisions that should be answered by talking to users, not by building in advance:

* Should the score be shown as a number (18/100) or a category (Hard cringe / Needs work / Clean / Fire)? Test both in the first week.

* Do brand users want to save and compare checks over time from day 1, or is that a month-2 feature? Ask, don’t assume.

* Is $19/mo the right price, or should it be $29? Run a landing page A/B test in week 3\.

* Should the rewrite match the original length exactly, or is it acceptable to be longer/shorter? Prompt engineering question — test with real users.

* Is the Indian market big enough at $19/mo, or should we price in INR (₹1,499/mo) for easier conversion? Research in week 2 during brand outreach.

# **12\. Appendix**

## **A. Prompt test cases**

Run these 10 inputs against the prompt before shipping. All should produce specific, useful output:

* A Mamaearth Instagram caption about a new face wash (D2C beauty, hard sell)

* An upGrad LinkedIn post about a data science course (EdTech, corporate tone)

* A CoinSwitch tweet about market volatility (fintech, jargon-heavy)

* A Zepto app push notification about a sale (quick commerce, discount-first)

* A Boat headphones TikTok script (consumer electronics, feature list)

* A startup founder’s personal LinkedIn post about hustle culture (individual creator)

* An FMCG brand tweet using ‘slay’ and ‘no cap’ incorrectly (cringe Gen Z speak attempt)

* A genuinely good brand tweet (should score 70+ and produce minimal issues)

* A blank/empty input (should error gracefully, not crash)

* A tweet in Hinglish (Hindi \+ English) — should still produce useful feedback

## **B. Non-goals (explicitly out of scope for v1)**

* Video analysis — text only for v1

* Image or design feedback — text only for v1

* Multi-language support beyond Hinglish — English \+ Hinglish only

* Historical trend tracking — month 2

* API for third-party integrations — month 3

* Mobile app — responsive web only for v1

## **C. Definition of done**

| This PRD is complete when: ✅ 1 paying customer exists ✅ They renewed for a second month without being asked ✅ At least one user said the rewrite was better than what they wrote themselves ✅ MRR \> $0 before any new product ideas are explored |
| :---- |

## **D. Interconnected Project Documents (May 2026)**

Post-validation and strategic artifacts for construction, marketing, and validation:

| Document | Description / Purpose |
| :--- | :--- |
| [Product Marketing Context](file:///Users/bharath/Desktop/on-going-projects/vibe_check_marketing/.agents/product-marketing-context.md) | Positioning, ICP, personas, objections, brand voice guidelines. |
| [DESIGN.md](file:///Users/bharath/Desktop/on-going-projects/vibe_check_marketing/DESIGN.md) | Design tokens, visual guidelines, typography, components. |
| [v1.1-features.md](file:///Users/bharath/Desktop/on-going-projects/vibe_check_marketing/docs/v1.1-features.md) | Revised roadmap priorities, verdict bands, and flow modifications. |
| [project_analysis.md](file:///Users/bharath/.gemini/antigravity/brain/0c6be20d-840f-4b61-bcec-d70a300836f6/project_analysis.md) | 360-degree leadership (CEO, CFO, CTO, PM, VC) analysis. |
| [growth_strategy.md](file:///Users/bharath/.gemini/antigravity/brain/0c6be20d-840f-4b61-bcec-d70a300836f6/growth_strategy.md) | Moat engineering, GTM loops, and programmatic cold outreach audits. |
| [unified_mvp_spec.md](file:///Users/bharath/.gemini/antigravity/brain/0c6be20d-840f-4b61-bcec-d70a300836f6/unified_mvp_spec.md) | Unified build blueprint combining product, design, and introvert sales playbooks. |


