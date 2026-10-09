import { getCollection, type CollectionEntry } from 'astro:content';
import { LANG_META, ROUTES, type Lang } from './i18n';

export type { Lang };

/** Section of the site each locale lives under. */
export const indexPath: Record<Lang, string> = ROUTES.news;

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
  d.toLocaleDateString(LANG_META[lang].dateLocale, {
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
type Key =
  | 'eyebrow' | 'h1' | 'subtitle' | 'upcoming' | 'articles' | 'readMore' | 'empty'
  | 'back' | 'when' | 'where' | 'price' | 'with' | 'register' | 'draft';

/** Every language must define every key: a missing one is a type error. */
export const t: Record<Lang, Record<Key, string>> = {
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
  es: {
    eyebrow: 'Noticias',
    h1: 'Noticias y artículos',
    subtitle:
      'Los próximos cursos, formaciones y talleres, y algunos artículos sobre el desarrollo del lenguaje y la comunicación.',
    upcoming: 'Próximos eventos',
    articles: 'Artículos',
    readMore: 'Leer más',
    empty: 'Por ahora no hay novedades. Vuelva pronto ✨',
    back: '← Todas las noticias',
    when: 'Cuándo',
    where: 'Dónde',
    price: 'Precio',
    with: 'En colaboración con',
    register: 'Inscribirse',
    draft: 'Borrador — solo visible en local',
  },
  it: {
    eyebrow: 'Notizie',
    h1: 'Notizie e articoli',
    subtitle:
      'I prossimi corsi, formazioni e laboratori, e alcuni articoli sullo sviluppo del linguaggio e della comunicazione.',
    upcoming: 'Prossimi eventi',
    articles: 'Articoli',
    readMore: 'Continua a leggere',
    empty: 'Per ora nessuna novità. Tornate presto ✨',
    back: '← Tutte le notizie',
    when: 'Quando',
    where: 'Dove',
    price: 'Prezzo',
    with: 'In collaborazione con',
    register: 'Iscriviti',
    draft: 'Bozza — visibile solo in locale',
  },
};
