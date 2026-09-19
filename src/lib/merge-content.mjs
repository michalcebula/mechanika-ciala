/** Merge published content into defaults, preserving empty lists and rejecting wrong types. */
export function mergeContent(defaults, published, path = 'content') {
  if (published === null || published === undefined) return defaults;
  if (Array.isArray(defaults)) {
    if (!Array.isArray(published)) throw new Error(`Expected list: ${path}`);
    return published.map((item, index) => {
      if (item === null || item === undefined) throw new Error(`Invalid list item: ${path}[${index}]`);
      if (defaults.length) return mergeContent(defaults[0], item, `${path}[${index}]`);
      return item;
    });
  }
  if (typeof defaults === 'object') {
    if (typeof published !== 'object' || Array.isArray(published)) throw new Error(`Expected object: ${path}`);
    return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, mergeContent(value, published[key], `${path}.${key}`)]));
  }
  if (typeof published !== typeof defaults) throw new Error(`Invalid value: ${path}`);
  return published;
}
