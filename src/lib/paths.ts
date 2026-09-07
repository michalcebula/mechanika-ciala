/** Resolve a site-local path under Astro's configured base, with one separator. */
export function withBase(path: string = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
