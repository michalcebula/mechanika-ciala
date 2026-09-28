import {useState} from 'react';
import type {UserViewComponent} from 'sanity/structure';

const siteUrl = (process.env.SANITY_STUDIO_SITE_URL || 'https://michalcebula.github.io/mechanika-ciala').replace(/\/$/, '');
const pages = [
  {label: 'Start', path: '/'},
  {label: 'O mnie', path: '/o-mnie/'},
  {label: 'Kontakt', path: '/kontakt/'},
  {label: 'Prywatność', path: '/prywatnosc/'},
];

export const SitePreview: UserViewComponent = () => {
  const [path, setPath] = useState('/');
  const [refresh, setRefresh] = useState(0);
  const url = `${siteUrl}${path}`;

  return (
    <div style={{display: 'flex', height: '100%', minHeight: 600, flexDirection: 'column', background: '#f3f3f3'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: 12, background: 'white', borderBottom: '1px solid #ddd'}}>
        {pages.map(page => (
          <button
            key={page.path}
            type="button"
            onClick={() => setPath(page.path)}
            style={{
              border: 0,
              borderRadius: 4,
              padding: '8px 12px',
              cursor: 'pointer',
              color: path === page.path ? 'white' : '#222',
              background: path === page.path ? '#123c33' : '#e8e8e8',
              fontWeight: 600,
            }}
          >
            {page.label}
          </button>
        ))}
        <button type="button" onClick={() => setRefresh(value => value + 1)} style={{marginLeft: 'auto', border: '1px solid #ccc', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', background: 'white'}}>
          Odśwież
        </button>
        <a href={url} target="_blank" rel="noreferrer" style={{display: 'inline-flex', alignItems: 'center', gap: 5, color: '#123c33', fontWeight: 600}}>
          Otwórz osobno
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
      <p style={{margin: 0, padding: '8px 12px', background: '#fff8dc', borderBottom: '1px solid #e5d79c', fontSize: 13}}>
        Po Publish GitHub Pages aktualizuje stronę automatycznie, zwykle w ciągu 5–10 minut. Potem kliknij Odśwież.
      </p>
      <iframe key={`${path}-${refresh}`} src={url} title="Podgląd strony Mechanika Ciała" style={{width: '100%', flex: 1, border: 0, background: 'white'}} />
    </div>
  );
};
