import { defineConfig } from 'astro/config';

const customSite = process.env.SITE_URL?.trim().replace(/\/+$/, '');

export default defineConfig({
  site: customSite || 'https://michalcebula.github.io',
  base: customSite ? '/' : '/mechanika-ciala',
});
