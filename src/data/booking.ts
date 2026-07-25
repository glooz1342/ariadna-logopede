// ─────────────────────────────────────────────────────────────
// Single source of truth for booking / contact endpoints.
// Change them here, not in the pages.
// ─────────────────────────────────────────────────────────────

/** Ariadna's Rosa profile (online booking). */
export const ROSA_URL = {
  fr: 'https://rosa.be/fr/hp/ariadna-balsells-mencaroni-poiani/',
  en: 'https://rosa.be/en/hp/ariadna-balsells-mencaroni-poiani/',
} as const;

/** WhatsApp number in wa.me format (no +, no spaces). */
export const WHATSAPP_NUMBER = '32474052583';

/**
 * Public URLs of the "consultation à domicile" Google Forms.
 *
 * Created by create-home-visit-forms.gs (Apps Script). Run that script,
 * then paste the two published URLs it logs in here.
 *
 * Format: https://docs.google.com/forms/d/e/<LONG_ID>/viewform
 *
 * While these still say PASTE_, the page shows a WhatsApp fallback
 * instead of a broken embed.
 */
export const HOME_VISIT_FORM = {
  fr: 'https://docs.google.com/forms/d/e/PASTE_FR_FORM_ID/viewform',
  en: 'https://docs.google.com/forms/d/e/PASTE_EN_FORM_ID/viewform',
} as const;

/** True once a real form URL has been pasted in above. */
export function isFormConfigured(url: string): boolean {
  return !url.includes('PASTE_');
}

/** Google Forms embed URL (adds the flag that strips the page chrome). */
export function toEmbedUrl(url: string): string {
  return url + (url.includes('?') ? '&' : '?') + 'embedded=true';
}
