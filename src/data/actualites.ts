import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'fr' | 'en';

/** Section of the site each locale lives under. */
export const indexPath: Record<Lang, string> = {
  fr: '/fr/actualites',
  en: '/en/news',
};

/** Entry ids are `<lang>/<slug>`; strip the locale prefix for the URL. */
export const slugOf = (id: string) => id.split('/').slice(1).join('/');

const forLang = <T extends { id: string; data: { draft: boolean } }>(
  entries: T[],
  lang: Lang,
) =>
  entries.filter(
    e => e.id.startsWith(`${lang}/`) && (import.meta.env.DEV || !e.data.draft),
  );

/**
 * An event counts as upcoming until the end of its last day, so a stage
 * running today still shows today rather than vanishing at midnight.
 */
const lastDay = (e: CollectionEntry<'evenements'>) => {
  const d = new Date(e.data.endDate ?? e.data.startDate);
  d.setHours(23, 59, 59, 999);
  return d;
};

export async function getEvents(lang: Lang) {
  const all = forLang(await getCollection('evenements'), lang);
  const now = new Date();
  return {
    // Soonest first: the next thing happening should be the first thing read.
    upcoming: all
      .filter(e => lastDay(e) >= now)
      .sort((a, b) => +a.data.startDate - +b.data.startDate),
    // Kept out of the index but still built, so old links never 404.
    past: all
      .filter(e => lastDay(e) < now)
      .sort((a, b) => +b.data.startDate - +a.data.startDate),
  };
}

export async function getArticles(lang: Lang) {
  return forLang(await getCollection('articles'), lang).sort(
    (a, b) => +b.data.date - +a.data.date,
  );
}

export const formatDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(lang === 'fr' ? 'fr-BE' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/** Date range, collapsed when start and end fall on the same day. */
export function formatRange(start: Date, end: Date | undefined, lang: Lang) {
  if (!end || +end === +start) return formatDate(start, lang);
  return `${formatDate(start, lang)} – ${formatDate(end, lang)}`;
}

// ⚠️ À FAIRE VALIDER PAR ARI : tous les intitulés ci-dessous.
export const t = {
  fr: {
    eyebrow: 'Actualités',
    h1: 'Actualités & articles',
    subtitle:
      "Les stages, formations et ateliers à venir, ainsi que quelques articles sur le développement du langage et de la communication.",
    upcoming: 'Prochains événements',
    articles: 'Articles',
    readMore: 'Lire la suite',
    empty: "Rien de neuf pour le moment. Revenez bientôt ✨",
    back: '← Toutes les actualités',
    when: 'Quand',
    where: 'Où',
    price: 'Tarif',
    with: 'En collaboration avec',
    register: "S'inscrire",
    draft: 'Brouillon — visible uniquement en local',
  },
  en: {
    eyebrow: 'News',
    h1: 'News & articles',
    subtitle:
      'Upcoming workshops, training sessions and group activities, plus a few articles on language and communication development.',
    upcoming: 'Upcoming events',
    articles: 'Articles',
    readMore: 'Read more',
    empty: 'Nothing new right now. Check back soon ✨',
    back: '← All news',
    when: 'When',
    where: 'Where',
    price: 'Price',
    with: 'In collaboration with',
    register: 'Register',
    draft: 'Draft — only visible locally',
  },
} as const;
