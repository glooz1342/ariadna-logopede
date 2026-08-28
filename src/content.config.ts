import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Two collections, each split by locale into an `fr/` and an `en/` subfolder.
 * Sveltia CMS writes into those folders directly (i18n structure:
 * multiple_folders), so an entry's id is `fr/mon-article` or `en/my-article`.
 *
 * English is optional per entry: a post that only exists in `fr/` simply
 * never appears on the English index. That keeps Ari from having to write
 * everything twice.
 */

/**
 * The CMS writes `''` for an optional field left blank, not nothing at all.
 * Zod's `.optional()` only accepts `undefined`, so an empty date or URL would
 * otherwise fail validation and break the build the moment Ari saves a post
 * without filling in every box.
 */
const blank = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(v => (v === '' || v === null ? undefined : v), schema.optional());

const url = () => blank(z.string().url());

/**
 * YAML turns an unquoted 2026-09-20 into a Date by itself, but a date the CMS
 * ever wrote in French order arrives as the string "20/09/2026", which
 * `new Date()` reads as an invalid date rather than failing loudly. Accept
 * both so an older file cannot take the build down.
 */
const asDate = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const fr = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return fr ? `${fr[3]}-${fr[2]}-${fr[1]}` : v;
};
const date = () => z.preprocess(asDate, z.coerce.date());
const optionalDate = () =>
  z.preprocess(v => (v === '' || v === null ? undefined : asDate(v)),
               z.coerce.date().optional());

const evenements = defineCollection({
  loader: glob({ base: './src/content/evenements', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    startDate: date(),
    endDate: optionalDate(),
    time: blank(z.string()),
    location: blank(z.string()),
    price: blank(z.string()),
    registrationUrl: url(),
    coOrganiserName: blank(z.string()),
    coOrganiserUrl: url(),
    cover: blank(z.string()),
    coverAlt: blank(z.string()),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    date: date(),
    cover: blank(z.string()),
    coverAlt: blank(z.string()),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { evenements, articles };
