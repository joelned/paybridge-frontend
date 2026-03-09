# PayBridge Microcopy Spec (v1)

## Voice and Tone
- Clear, direct, and calm.
- Trust-first for payment and security contexts.
- No blame language.
- Keep sentences short and action-oriented.

## Rules
1. Labels
- Use concise nouns or noun phrases.
- Examples: `Email`, `Password`, `Business Country`, `Webhook Secret`.

2. Helper Text
- One purpose per line.
- Explain why the field matters, not how forms work.
- Example: `Used for compliance and payout routing.`

3. Error Messages
- Plain language + action.
- Structure: `What failed. What to do next.`
- Examples:
  - `Code expired. Request a new code to continue.`
  - `Unable to load provider data. Try again.`

4. Success Messages
- Confirm completion + next step.
- Structure: `Done. Next: ...`
- Examples:
  - `Email verified. Next: sign in to your account.`
  - `API key generated. Next: copy it and store it in your backend secrets manager.`

5. Next-Step Cues
- Add explicit “what happens next” guidance for multi-step tasks.
- Required for: register, email verification resend, key rotation, and docs errors.

## Priority Flow Copy Targets
- Register
- Verify Email
- Payment Integration
- API Docs
