/* contact.ts
   Single source of truth for the dossier's direct contact paths.

   WHY THIS FILE EXISTS:
   The Inquiry composer used to be the ONLY way to reach Ebenz, and its email
   button was gated on the VITE_CONTACT_EMAIL build variable. When that variable
   wasn't set at deploy time, the button silently disabled and a warm visitor had
   no destination at all. This file removes that single point of failure: the
   email below is hardcoded and always live, no environment configuration needed.

   HOW TO UPDATE: change the values here once and every contact surface (nav,
   footer, Inquiry panel) updates with it. Leave a field as an empty string ('')
   to hide that channel — UI checks for non-empty before rendering, so an empty
   value never produces a broken link. */

export interface ContactChannels {
  /** Always-live public email. Critical path — keep this filled. */
  email: string;
  /** Full LinkedIn profile URL (e.g. https://www.linkedin.com/in/...).
      Empty string hides the LinkedIn link until a real URL is set. */
  linkedin: string;
}

export const CONTACT: ContactChannels = {
  email: 'ebenz.aug@gmail.com',
  linkedin: '', // TODO: paste full LinkedIn profile URL to switch this channel on.
};

/** True when the LinkedIn URL is set to a real value. */
export const hasLinkedIn = CONTACT.linkedin.trim().length > 0;
