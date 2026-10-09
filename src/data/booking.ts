// ─────────────────────────────────────────────────────────────
// Single source of truth for booking / contact endpoints.
// Change them here, not in the pages.
// ─────────────────────────────────────────────────────────────

import type { Lang } from './i18n';

/**
 * Ariadna's Rosa profile (online booking).
 * Rosa only exists in French, Dutch and English, so the Spanish and Italian
 * pages send visitors to the French one.
 */
export const ROSA_URL: Record<Lang, string> = {
  fr: 'https://rosa.be/fr/hp/ariadna-balsells-mencaroni-poiani/',
  en: 'https://rosa.be/en/hp/ariadna-balsells-mencaroni-poiani/',
  es: 'https://rosa.be/fr/hp/ariadna-balsells-mencaroni-poiani/',
  it: 'https://rosa.be/fr/hp/ariadna-balsells-mencaroni-poiani/',
};

/** WhatsApp number in wa.me format (no +, no spaces). */
export const WHATSAPP_NUMBER = '32490461294';

/** Ready-made wa.me link. Use this in pages rather than hardcoding the number. */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Same number in E.164 form, for tel: links and structured data. */
export const PHONE_E164 = `+${WHATSAPP_NUMBER}`;

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
export const HOME_VISIT_FORM: Record<Lang, string> = {
  fr: 'https://docs.google.com/forms/d/e/PASTE_FR_FORM_ID/viewform',
  en: 'https://docs.google.com/forms/d/e/PASTE_EN_FORM_ID/viewform',
  es: 'https://docs.google.com/forms/d/e/PASTE_ES_FORM_ID/viewform',
  it: 'https://docs.google.com/forms/d/e/PASTE_IT_FORM_ID/viewform',
};

/** True once a real form URL has been pasted in above. */
export function isFormConfigured(url: string): boolean {
  return !url.includes('PASTE_');
}

/** Google Forms embed URL (adds the flag that strips the page chrome). */
export function toEmbedUrl(url: string): string {
  return url + (url.includes('?') ? '&' : '?') + 'embedded=true';
}
