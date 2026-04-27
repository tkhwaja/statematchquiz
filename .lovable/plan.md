## Send correction email to the 6 affected recipients

### What will happen
1. Deploy the `send-correction-email` edge function (already scaffolded in code).
2. Invoke it once. It will:
   - Query the 6 recipients who received the bad $149 follow-up (those with `followup_sent_at` set in `email_captures` matching the original 6).
   - Send each one the approved correction email via Resend (`support@statematchquiz.com`), personalized with their first name (fallback "Hi there" for "k y").
   - Log each send to `email_send_log`.
3. Verify all 6 sent successfully via logs + `email_send_log`.
4. Delete the `send-correction-email` function (code + deployed) so it cannot run again.

### Email being sent
**From:** StateMatch Team `<support@statematchquiz.com>`
**Subject:** Correction: your StateMatch report is $6.99, not $149
**Body:** the exact copy you approved, with personalized greeting and a link to unlock the report for $6.99.

### Recipients
Anita, Deanna, Billiam, Kaitlyn, Joy, k y (6 total).

Approve and I'll send immediately, then tear down the function.