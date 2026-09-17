// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ariadna-logopede.be',

  /**
   * Fonts are downloaded at build time and served from this domain.
   *
   * Loading them from fonts.googleapis.com sent every visitor's IP to Google
   * before the cookie banner was answered — the banner gates GA4 and the Maps
   * iframe, but a stylesheet in <head> fires regardless of consent. Self-hosting
   * closes that gap, and removes two render-blocking third-party round trips.
   *
   * latin-ext is included alongside latin for the French ligatures (œ, Œ) that
   * fall outside the base latin subset.
   */
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter Tight',
      cssVariable: '--font-inter-tight',
      weights: [700, 800],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [300, 400, 500],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
      weights: [400, 500],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['cursive'],
    },
  ],

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-BE',
          en: 'en',
        },
      },
    }),
  ],
});
