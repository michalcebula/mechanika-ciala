import { withBase } from '../lib/paths';
import type { APIRoute } from 'astro';
import {getContent} from '../lib/content';
export const GET: APIRoute = async ({site}) => {
 const c=await getContent();
 return new Response(site && c.privacyApproved ? `User-agent: *\nAllow: /\nSitemap: ${new URL(withBase('sitemap.xml'),site)}\n` : 'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain'}});
};
