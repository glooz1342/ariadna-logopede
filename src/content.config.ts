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

const eventFields = ({ image }: { image: () => any }) =>
  z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    price: z.string().optional(),
    registrationUrl: z.string().url().optional(),
    coOrganiserName: z.string().optional(),
    coOrganiserUrl: z.string().url().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    summary: z.string(),
    draft: z.boolean().default(false),
  });

const articleFields = ({ image }: { image: () => any }) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    summary: z.string(),
    draft: z.boolean().default(false),
  });

const evenements = defineCollection({
  loader: glob({ base: './src/content/evenements', pattern: '**/[^_]*.md' }),
  schema: eventFields,
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/[^_]*.md' }),
  schema: articleFields,
});

export const collections = { evenements, articles };
