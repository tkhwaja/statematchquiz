
## Revert to Paid Results (1-Week Test)

Going back to the previous paid model: all 5 state matches blurred behind a paywall, Tier 2 waitlist removed.

### What changes

**ResultPreview.tsx (the page after email capture)**
- Keep the 5 state cards rendering in countdown order (#5 → #1)
- Apply heavy blur (`blur-md` + `pointer-events-none select-none`) to all 5 cards so state names and details are unreadable
- Overlay a centered "Unlock Your Results" card on top:
  - Headline: "Unlock Your Personalized State Matches"
  - Subtext: "See your top 5 state matches with full details, best cities, and why each one fits you."
  - Price: **$6.99** (one-time)
  - Button: "Unlock My Results" → calls `create-payment` edge function → redirects to Stripe Checkout
  - Trust line: "Secure checkout via Stripe"
- Remove the Tier 2 "Coming Soon / Join the Waitlist" upsell card entirely
- Keep the "Read the Blog" card (good for SEO/engagement)
- Hide share buttons until unlock (sharing blurred results doesn't make sense)

**ResultFull.tsx (the unlocked view, shown after Stripe success)**
- Already renders full results — keep as-is
- Remove the bottom "Your Detailed Relocation Analysis is being prepared" placeholder (that was Tier 2 messaging)

**Stripe / edge function**
- Create a new $6.99 Stripe product + price
- Update `create-payment` edge function to use the new $6.99 price ID (currently set to the $149 price)

**Routes & cleanup**
- `/checkout` route: redirect to `/result/preview` so old links don't 404. The waitlist page file can stay but is unlinked.
- No DB schema changes — `tier2_waitlist` table stays (harmless)

**PostHog events**
- Re-add `checkout_initiated` when the unlock button is clicked
- Remove `waitlist_cta_clicked` / `waitlist_page_viewed`

### Files I'll edit
- `src/pages/ResultPreview.tsx` — blur + paywall overlay, remove waitlist upsell
- `src/pages/ResultFull.tsx` — remove Tier 2 placeholder card
- `src/App.tsx` — redirect `/checkout` to `/result/preview`
- `supabase/functions/create-payment/index.ts` — swap price ID to new $6.99 price
- (Stripe) Create new $6.99 product + price

### About the AI model question
The model powering me (the assistant building your site) isn't something I share specifically — Lovable runs on a mix of frontier models that get swapped as better ones come out. Separately, the AI *inside your app* (the customer support chat widget) runs on `google/gemini-2.5-flash` via Lovable AI Gateway, and you can swap that one anytime.

### One quick confirmation before building
Your memory file lists **$6.99** as the original price. I'll use that unless you tell me otherwise. If you'd rather test $4.99 or $9.99 during this 1-week window, say the word and I'll adjust before building.
