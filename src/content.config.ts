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

const evenements = defineCollection({
  loader: glob({ base: './src/content/evenements', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: blank(z.coerce.date()),
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
    date: z.coerce.date(),
    cover: blank(z.string()),
    coverAlt: blank(z.string()),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { evenements, articles };
