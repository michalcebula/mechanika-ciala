/**
 * A section fragment takes precedence over the home page link.
 * @param {string} href
 * @param {string} location
 * @returns {'page' | 'location' | undefined}
 */
export function currentNavValue(href, location) {
  const current = new URL(location);
  const target = new URL(href, current);
  if (target.origin !== current.origin ||
      target.pathname.replace(/\/$/, '') !== current.pathname.replace(/\/$/, '')) return;
  if (target.hash) return target.hash === current.hash ? 'location' : undefined;
  return current.hash === '#jak-pomagam' ? undefined : 'page';
}
