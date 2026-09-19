import {defineType,defineField, type FieldDefinition} from 'sanity';
import editorial from '../src/lib/editorial.json';
import {defaults} from '../src/lib/defaults';

// Image uploads are Sanity assets; local photos remain website fallbacks.
const {heroImage, portraitImage, clinicImage, treatmentImage, ...initialContent} = defaults;
function withKeys(value: unknown): unknown {
 if (Array.isArray(value)) return value.map((item, index) => typeof item === 'object' && item !== null ? {...withKeys(item) as object, _key: `item${index}`} : item);
 if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withKeys(item)]));
 return value;
}
const text=(name:string,title:string,type='string')=>defineField({name,title,type});
const image=(name:string,title:string)=>defineField({name,title,type:'image',description:'Zdjęcie może być używane w kilku miejscach strony. Po usunięciu wraca lokalne zdjęcie domyślne.'});
const list=(name:string,title:string,fields:FieldDefinition[])=>defineField({name,title,type:'array',of:[{type:'object',fields}]});

const groupTitles: Record<string, string> = {"home": "Strona główna", "about": "O mnie", "contact": "Kontakt", "shared": "Menu i stopka", "privacy": "Prywatność", "notFound": "Strona 404", "images": "Opisy zdjęć"};
const fieldTitles: Record<string, string> = {"eyebrow": "Nadtytuł", "approachLink": "Link do podejścia", "profession": "Podpis — zawód", "photoLabel": "Podpis na zdjęciu", "trustLabel": "Pasek zaufania — hasło", "clinicLabel": "Pasek zaufania — gabinet", "helpLabel": "Jak pomagam — nadtytuł", "cooperationLabel": "Współpraca — nadtytuł", "cooperationLink": "Współpraca — tekst linku", "aboutLabel": "Poznajmy się — nadtytuł", "aboutLink": "Poznajmy się — tekst linku", "reviewsLabel": "Opinie — nadtytuł", "reviewsLink": "Opinie — tekst linku", "helpTitle": "Jak pomagam — nagłówek", "cooperationTitle": "Współpraca — nagłówek", "aboutTitle": "Poznajmy się — nagłówek", "reviewsTitle": "Opinie — nagłówek", "helpParagraphs": "Jak pomagam — akapity", "cooperationParagraphs": "Współpraca — akapity", "seoTitle": "SEO — tytuł strony", "seoDescription": "SEO — opis strony", "credentialsLabel": "Kwalifikacje — nadtytuł", "credentialsTitle": "Kwalifikacje — nagłówek", "values": "Etapy pracy", "title": "Nagłówek", "personDescription": "Podpis pod nazwiskiem", "locationLabel": "Adres — nadtytuł", "directionsLink": "Mapa — tekst linku", "footerLabel": "Stopka — nadtytuł", "footerTitle": "Stopka — nagłówek", "brandSubtitle": "Podpis pod nazwą firmy", "privacyLink": "Link do polityki prywatności", "navHome": "Menu — strona główna", "navHelp": "Menu — jak pomagam", "navAbout": "Menu — o mnie", "navContact": "Menu — kontakt", "bookingLabel": "Przycisk rezerwacji — pełny", "navBookingLabel": "Przycisk rezerwacji — w menu", "description": "Opis", "backLabel": "Przycisk powrotu", "index0": "Strona główna — zdjęcie terapii", "index1": "Strona główna — portret", "o_mnie0": "O mnie — portret", "o_mnie1": "O mnie — terapia", "o_mnie2": "O mnie — gabinet", "kontakt0": "Kontakt — gabinet", "kontakt1": "Kontakt — terapia", "kontakt2": "Kontakt — terapia szyi"};

const copyFields = Object.entries(editorial).map(([group, values]) => defineField({
 name: group, title: groupTitles[group], type: 'object',
 options: {collapsible: true, collapsed: true},
 fields: Object.entries(values).map(([name, value]) => {
  const title = fieldTitles[name];
  if (name === 'values') return list(name, title, [text('title','Tytuł'), text('text','Opis','text')]);
  if (Array.isArray(value)) return defineField({name,title,type:'array',of:[{type:'text'}]});
  return defineField({name,title,type:'text',rows:2,description:'Nowa linia w nagłówku dzieli wiersze. Usunięcie pola przywraca treść domyślną.'});
 })
}));
export const siteSettings=defineType({name:'siteSettings',title:'Treści strony',type:'document',initialValue:()=>withKeys(initialContent) as Record<string, unknown>,fields:[
 defineField({name:'copy',title:'Treści podstron, menu i stopki',type:'object',fields:copyFields}),
 defineField({name:'workDescription',title:'Dawne akapity — zachowane dla zgodności',type:'array',of:[{type:'text'}],hidden:true}),
 {...list('methods','Dawne metody — zachowane dla zgodności',[text('title','Tytuł'),text('description','Opis','text')]),hidden:true},
 text('name','Nazwa firmy'),text('person','Imię i nazwisko'),
 text('heroTitle','Nagłówek główny (nowa linia dzieli wiersze)','text'),text('heroDescription','Opis strony głównej','text'),
 text('aboutTitle','Nagłówek O mnie','text'),defineField({name:'biography',title:'Biografia — akapity',type:'array',of:[{type:'text'}]}),

 text('location','Lokalizacja'),text('address','Pełny adres'),text('phone','Telefon'),text('email','E-mail'),
 ...['booksyUrl','googleUrl','facebookUrl'].map(name=>defineField({name,title:({booksyUrl:'Rezerwacja — link Booksy',googleUrl:'Link Google Maps',facebookUrl:'Link Facebook'} as Record<string,string>)[name],type:'url',validation:Rule=>Rule.uri({scheme:['https']})})),
 image('heroImage','Zdjęcie główne'),image('portraitImage','Portret Kamila'),image('clinicImage','Gabinet'),image('treatmentImage','Kontakt — zdjęcie terapii szyi'),
 list('services','W czym pomagam',[text('title','Tytuł'),text('description','Opis','text')]),

 list('credentials','Potwierdzone wykształcenie i certyfikaty',[text('title','Kwalifikacja'),text('institution','Organizator / uczelnia'),text('year','Rok')]),
 list('reviews','Opinie — tylko zweryfikowane i dopuszczone do publikacji',[text('name','Podpis'),text('text','Treść','text')]),
 text('rating','Potwierdzona ocena Booksy'),text('reviewCount','Liczba opinii'),
 defineField({name:'privacyText',title:'Zatwierdzona polityka prywatności — akapity',type:'array',of:[{type:'text'}]}),
 defineField({name:'privacyApproved',title:'Polityka zatwierdzona; gotowość do indeksowania',type:'boolean',initialValue:false,description:'Zaznacz dopiero po weryfikacji danych, polityki i konfiguracji hostingu.'})
]});
