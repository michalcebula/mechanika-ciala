import {useState} from 'react';
import type {UserViewComponent} from 'sanity/structure';

const siteUrl = 'https://michalcebula.github.io/mechanika-ciala';
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
        <a href={url} target="_blank" rel="noreferrer" style={{color: '#123c33', fontWeight: 600}}>
          Otwórz osobno ↗
        </a>
      </div>
      <p style={{margin: 0, padding: '8px 12px', background: '#fff8dc', borderBottom: '1px solid #e5d79c', fontSize: 13}}>
        Podgląd pokazuje ostatnią wersję wdrożoną na GitHub Pages. Po Publish uruchom „Deploy to GitHub Pages”, a potem kliknij Odśwież.
      </p>
      <iframe key={`${path}-${refresh}`} src={url} title="Podgląd strony Mechanika Ciała" style={{width: '100%', flex: 1, border: 0, background: 'white'}} />
    </div>
  );
};
