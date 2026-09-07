import { withBase } from '../lib/paths';
import type { APIRoute } from 'astro';
export const GET: APIRoute = ({site}) => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? ['/','/o-mnie/','/kontakt/','/prywatnosc/'].map(p=>`<url><loc>${new URL(withBase(p),site).href}</loc></url>`).join('') : ''}</urlset>`,{headers:{'Content-Type':'application/xml'}});
