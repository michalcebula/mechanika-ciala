import { withBase } from './paths';
import { createClient } from '@sanity/client';
export const fallback = {
  name: 'Mechanika Ciała', person: 'Kamil Szuwalski',
  heroTitle: 'Ruch bez bólu.\nSprawność na lata.',
  heroDescription: 'Fizjoterapia i terapia manualna na krakowskim Zabłociu. Zadbaj o swobodę ruchu — na treningu i na co dzień.',
  aboutTitle: 'Doświadczenie i indywidualne podejście.',
  biography: [
    'Nazywam się Kamil Szuwalski. Jestem fizjoterapeutą i prowadzę gabinet Mechanika Ciała w XXS Gym na krakowskim Zabłociu.',
    'Fizjoterapią zajmuję się od ponad 12 lat. W 2016 roku ukończyłem studia na Wydziale Rehabilitacji Ruchowej Akademii Wychowania Fizycznego im. Bronisława Czecha w Krakowie.',
    'Specjalizuję się w terapii manualnej, terapii bólu i rehabilitacji neurologicznej. Regularnie rozwijam swoje umiejętności na kursach i szkoleniach, potwierdzonych certyfikatami.'
  ],
  workDescription: [
    'Pomagam pacjentom odzyskać sprawność, by mogli cieszyć się aktywnością i komfortem życia bez bólu. Podczas wizyty zbadam Twój problem, dobiorę terapię do Twoich potrzeb, zaproponuję ćwiczenia i przekażę wskazówki do pracy w domu.',
    'Zajmuję się terapią bólu kręgosłupa, mięśni i stawów oraz rehabilitacją po urazach i operacjach ortopedycznych i neurologicznych. W pracy wykorzystuję między innymi terapię manualną.'
  ],
  location: 'XXS Gym · Kraków, Zabłocie', address: 'Zabłocie 24, 30-522 Kraków', phone: '+48 662 927 063', email: 'kamil.szuwal@gmail.com',
  booksyUrl: 'https://booksy.com/pl-pl/181396_mechanika-ciala-fizjoterapia-pl-eng_fizjoterapia_8820_krakow',
  googleUrl: 'https://share.google/gPZM8yGCFEF1AZ5pD',
  facebookUrl: 'https://www.facebook.com/MechanikaCialaFizjoterapia/',
  heroImage: withBase('/images/terapia.jpg'), portraitImage: withBase('/images/kamil.jpg'), clinicImage: withBase('/images/gabinet.jpg'),
  services: [
    { title: 'Ból pleców i napięcie', description: 'Gdy dolegliwości przeszkadzają w pracy, odpoczynku lub codziennym ruchu.' },
    { title: 'Ograniczona ruchomość', description: 'Gdy chcesz przyjrzeć się ograniczeniom i zadbać o swobodniejszy ruch.' },
    { title: 'Powrót do aktywności', description: 'Gdy potrzebujesz indywidualnego planu powrotu do ruchu po przerwie.' },
    { title: 'Wsparcie treningu', description: 'Gdy chcesz połączyć fizjoterapię z pracą nad swoją sprawnością.' }
  ],
  methods: [{ title: 'Terapia manualna', description: 'Praca z ciałem dostosowana do badania, Twoich potrzeb i możliwości.' }, { title: 'Współpraca z trenerami', description: 'Fizjoterapia i trening jako uzupełniające się elementy pracy nad sprawnością.' }],
  credentials: [] as { title: string; institution: string; year?: string }[],
  // Verified against the public Booksy profile on 2026-09-07; update manually or through Sanity.
  reviews: [] as { name: string; text: string }[], rating: '5.0', reviewCount: '81',
  privacyApproved: false, privacyText: [] as string[]
};
export type Content = typeof fallback;
let cached: Promise<Content> | undefined;
export function getContent(): Promise<Content> {
  return cached ??= load();
}
async function load(): Promise<Content> {
  const projectId = import.meta.env.SANITY_PROJECT_ID;
  const dataset = import.meta.env.SANITY_DATASET;
  if (!projectId && !dataset) return fallback;
  if (!projectId || !dataset) throw new Error('Set both SANITY_PROJECT_ID and SANITY_DATASET.');
  const client = createClient({ projectId, dataset, apiVersion: '2025-02-19', useCdn: false, perspective: 'published', token: import.meta.env.SANITY_READ_TOKEN || undefined });
  const doc = await client.fetch('*[_type == "siteSettings"] | order(_updatedAt desc)[0]{..., "heroImage":heroImage.asset->url,"portraitImage":portraitImage.asset->url,"clinicImage":clinicImage.asset->url}');
  if (!doc) throw new Error('Publish a siteSettings document in Sanity before building.');
  const data = { ...fallback, ...Object.fromEntries(Object.entries(doc).filter(([, v]) => v !== null && v !== undefined)) } as Content;
  for (const key of ['booksyUrl', 'googleUrl', 'facebookUrl'] as const) {
    if (!data[key].startsWith('https://')) throw new Error(`Invalid HTTPS link: ${key}`);
  }
  return data;
}
