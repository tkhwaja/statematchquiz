## What actually happened (important — read first)

Your **Stripe checkout is correctly charging $6.99**. The price ID wired into `create-payment` is `price_1SFN4HBxcerrFxP41N9akDYE` = 699 cents. No customer was overcharged.

The **$149 was only hardcoded inside the follow-up teaser email's HTML** (line 113 of `send-followup-teaser/index.ts`). That number came from a stale memory note from when you originally planned a higher-priced upsell. Anyone who received the teaser saw "$149 — instant access" and (understandably) bailed.

Two separate problems to fix:
1. Stop the automated teaser from going out.
2. Fix the price in the email and redesign it properly.

## Plan

### 1. Pause the automated follow-up immediately (highest priority)

The teaser is triggered by a pg_cron job (`send-followup-teaser-hourly`, runs every hour at :00). I'll **disable the cron job** so nothing else goes out, while leaving the function code in place so we can iterate safely.

```sql
-- via supabase insert/migration
SELECT cron.unschedule('send-followup-teaser-hourly');
```

After this, zero follow-up emails can send until you explicitly approve a new design.

### 2. Fix the wrong price in the existing teaser (defensive — in case it ever runs again)

In `supabase/functions/send-followup-teaser/index.ts` line 113, change:
- `One-time $149 — instant access` → `One-time $6.99 — instant access`

Even though the cron is paused, leaving "$149" sitting in the codebase is a landmine. Fix it now.

### 3. Update the memory file that caused this

`mem://integrations/stripe` still says "$149 'Personalized Relocation Report'". I'll rewrite it to reflect reality: **$6.99 one-time** report, price ID `price_1SFN4HBxcerrFxP41N9akDYE`. This prevents me (or any future session) from re-introducing the $149 number anywhere.

### 4. Pull the list of who already got the wrong-price email

So you can decide whether to personally apologize / send a corrected note. I'll query:

```sql
SELECT email, name, followup_sent_at
FROM email_captures
WHERE followup_sent_at IS NOT NULL
ORDER BY followup_sent_at DESC;
```

and give you the list in chat. I will **not** send anything to them.

### 5. Custom follow-up email design (your call on whether/when)

You said the generic design won't work and you want to design it yourself. Two options — I need you to pick before I build anything:

**A. You design it, I implement it.**
- You send me the design (Figma, screenshots, or just describe it: copy, hero image, color, CTA, sections you want).
- I rebuild the teaser HTML to match.
- The cron stays OFF until you give explicit approval per send.

**B. I draft a few design directions for your approval first.**
- I'll mock 2–3 different email designs in HTML (rendered as preview images so you can actually see them) using StateMatch branding.
- You pick / edit / reject.
- Same rule: cron stays OFF, no automated sending until you say "go".

Either way, the new policy I'll follow:

> **Never enable automated outbound email without explicit per-feature approval from you.** Drafts only. You press the button.

I'll save that as a hard rule in project memory so it carries forward.

## Files that will change

- `supabase/functions/send-followup-teaser/index.ts` — fix `$149` → `$6.99` (1 line)
- New SQL migration — `cron.unschedule('send-followup-teaser-hourly')`
- `mem://integrations/stripe` — correct the price
- `mem://index.md` — add Core rule: "Never enable automated outbound emails without explicit user approval per send."
- Redeploy `send-followup-teaser`

## What I need from you

1. **Confirm** you want me to disable the cron + fix the $149 string + update memory. (This is the safe, non-destructive baseline.)
2. **Pick A or B** for the redesign — or say "leave the email work for later, just stop the bleeding now."
