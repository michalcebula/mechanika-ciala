import {defineType,defineField, type FieldDefinition} from 'sanity';
import editorial from '../src/lib/editorial.json';
import {defaults} from '../src/lib/defaults';

// Image uploads are Sanity assets; local photos remain website fallbacks.
const {heroImage, portraitImage, clinicImage, treatmentImage, copy, ...initialContent} = defaults;
const trainersWithoutImages = initialContent.trainers.map(({image: _image, ...trainer}) => trainer);
const initialDocument = {...initialContent, trainers: trainersWithoutImages, ...copy};
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

const pageFields = Object.entries(editorial).map(([group, values]) => defineField({
 name: group, title: groupTitles[group], type: 'object',
 group: group === 'notFound' ? 'other' : group,
 fields: Object.entries(values).map(([name, value]) => {
  const title = fieldTitles[name];
  if (name === 'values') return list(name, title, [text('title','Tytuł'), text('text','Opis','text')]);
  if (Array.isArray(value)) return defineField({name,title,type:'array',of:[{type:'text'}]});
  return defineField({name,title,type:'text',rows:2,description:'Nowa linia w nagłówku dzieli wiersze. Usunięcie pola przywraca treść domyślną.'});
 })
}));
export const siteSettings=defineType({
 name:'siteSettings',
 title:'Treści strony',
 type:'document',
 groups:[
  {name:'home',title:'Strona główna',default:true},
  {name:'about',title:'O mnie'},
  {name:'contact',title:'Kontakt'},
  {name:'shared',title:'Menu i stopka'},
  {name:'images',title:'Zdjęcia'},
  {name:'privacy',title:'Prywatność'},
  {name:'other',title:'Pozostałe'}
 ],
 preview:{prepare:()=>({title:'Mechanika Ciała — treści',subtitle:'Edycja całej strony'})},
 initialValue:()=>withKeys(initialDocument) as Record<string, unknown>,
 fields:[
 ...pageFields,
 defineField({name:'workDescription',title:'Dawne akapity — zachowane dla zgodności',type:'array',of:[{type:'text'}],hidden:true}),
 {...list('methods','Dawne metody — zachowane dla zgodności',[text('title','Tytuł'),text('description','Opis','text')]),hidden:true},
 {...text('name','Nazwa firmy'),group:'shared'},{...text('person','Imię i nazwisko'),group:'shared'},
 {...text('heroTitle','Główny nagłówek strony','text'),group:'home'},{...text('heroDescription','Opis pod głównym nagłówkiem','text'),group:'home'},
 {...text('aboutTitle','Główny nagłówek strony O mnie','text'),group:'about'},defineField({name:'biography',title:'Biografia — akapity',type:'array',group:'about',of:[{type:'text'}]}),

 {...text('location','Nazwa lokalizacji'),group:'contact'},{...text('address','Pełny adres'),group:'contact'},{...text('phone','Telefon'),group:'contact'},{...text('email','E-mail'),group:'contact'},
 ...['booksyUrl','googleUrl','facebookUrl'].map(name=>defineField({name,title:({booksyUrl:'Rezerwacja — link Booksy',googleUrl:'Link Google Maps',facebookUrl:'Link Facebook'} as Record<string,string>)[name],type:'url',group:name==='booksyUrl'?'shared':'contact',validation:Rule=>Rule.uri({scheme:['https']})})),
 {...image('heroImage','Zdjęcie główne — terapia'),group:'images'},{...image('portraitImage','Portret Kamila'),group:'images'},{...image('clinicImage','Zdjęcie gabinetu'),group:'images'},{...image('treatmentImage','Kontakt — zdjęcie terapii szyi'),group:'images'},
 {...list('services','Kafelki „W czym pomagam”',[text('title','Tytuł'),text('description','Opis','text')]),group:'home'},
 {...list('trainers','Trenerzy — kafle współpracy',[
  text('name','Imię i nazwisko'),
  text('qualification','Wykształcenie'),
  text('role','Rola'),
  defineField({name:'instagramUrl',title:'Instagram — link',type:'url',validation:Rule=>Rule.uri({scheme:['https']})}),
  image('image','Zdjęcie trenera')
 ]),group:'home'},

 {...list('credentials','Wykształcenie i certyfikaty',[text('title','Kwalifikacja'),text('institution','Organizator / uczelnia'),text('year','Rok')]),group:'about'},
 {...list('reviews','Opinie pacjentów',[text('name','Podpis'),text('text','Treść','text')]),group:'home'},
 {...text('rating','Ocena Booksy'),group:'home'},{...text('reviewCount','Liczba opinii'),group:'home'},
 defineField({name:'privacyText',title:'Polityka prywatności — akapity',type:'array',group:'privacy',of:[{type:'text'}]}),
 defineField({name:'privacyApproved',title:'Polityka zatwierdzona; gotowość do indeksowania',type:'boolean',group:'privacy',initialValue:false,description:'Zaznacz dopiero po weryfikacji danych, polityki i konfiguracji hostingu.'})
]});
