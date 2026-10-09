// ─────────────────────────────────────────────────────────────
// Languages and page routes. Single source of truth: adding a
// language or a page means editing this file, not each component.
// ─────────────────────────────────────────────────────────────

/** Site languages, in the order the switcher shows them. French is the source. */
export const LANGS = ['fr', 'en', 'es', 'it'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_META: Record<Lang, {
  /** Language name in that language, for the switcher's accessible label. */
  name: string;
  /** hreflang value for alternates. */
  hreflang: string;
  /** Open Graph locale. */
  ogLocale: string;
  /** Locale passed to toLocaleDateString. */
  dateLocale: string;
  /** Label of the language switcher group, in that language. */
  switcherLabel: string;
}> = {
  fr: { name: 'Français', hreflang: 'fr-BE', ogLocale: 'fr_BE', dateLocale: 'fr-BE', switcherLabel: 'Langue' },
  en: { name: 'English', hreflang: 'en', ogLocale: 'en_GB', dateLocale: 'en-GB', switcherLabel: 'Language' },
  es: { name: 'Español', hreflang: 'es', ogLocale: 'es_ES', dateLocale: 'es-ES', switcherLabel: 'Idioma' },
  it: { name: 'Italiano', hreflang: 'it', ogLocale: 'it_IT', dateLocale: 'it-IT', switcherLabel: 'Lingua' },
};

/**
 * The same page in every language. Used for hreflang alternates and the
 * header language switcher, so switching language keeps you on the same page.
 * Paths without trailing slash.
 */
export const ROUTES = {
  home:     { fr: '/fr', en: '/en', es: '/es', it: '/it' },
  about:    { fr: '/fr/apropos', en: '/en/about', es: '/es/sobre-mi', it: '/it/chi-sono' },
  contact:  { fr: '/fr/contact', en: '/en/contact', es: '/es/contacto', it: '/it/contatti' },
  news:     { fr: '/fr/actualites', en: '/en/news', es: '/es/noticias', it: '/it/notizie' },
  cookies:  { fr: '/fr/cookies', en: '/en/cookies', es: '/es/cookies', it: '/it/cookie' },
  practice: {
    fr: '/fr/consultation/en-cabinet',
    en: '/en/consultation/at-the-practice',
    es: '/es/consulta/en-el-centro',
    it: '/it/consulenza/in-studio',
  },
  homeVisit: {
    fr: '/fr/consultation/a-domicile',
    en: '/en/consultation/at-home',
    es: '/es/consulta/a-domicilio',
    it: '/it/consulenza/a-domicilio',
  },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof ROUTES;

/** Language of a URL path, from its first segment. Defaults to French. */
export function langFromPath(pathname: string): Lang {
  const seg = pathname.split('/')[1];
  return (LANGS as readonly string[]).includes(seg) ? (seg as Lang) : 'fr';
}

/** The route entry a path belongs to, if it is one of the mapped pages. */
export function routeOf(pathname: string): Record<Lang, string> | undefined {
  const p = pathname.replace(/\/+$/, '') || '/';
  return Object.values(ROUTES).find(r => (Object.values(r) as string[]).includes(p));
}

/**
 * Where the switcher should send a visitor from `pathname` to `target`:
 * the same page if it is mapped; for a news post (which may not exist in the
 * other language) that language's news index; otherwise its home page.
 */
export function counterpart(pathname: string, target: Lang): string {
  const mapped = routeOf(pathname);
  if (mapped) return mapped[target];
  const p = pathname.replace(/\/+$/, '');
  const inNews = Object.values(ROUTES.news).some(n => p.startsWith(`${n}/`));
  return inNews ? ROUTES.news[target] : ROUTES.home[target];
}
