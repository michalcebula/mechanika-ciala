import {defineType,defineField} from 'sanity';
const text=(name:string,title:string,type='string')=>defineField({name,title,type});
const image=(name:string,title:string)=>defineField({name,title,type:'image',options:{hotspot:true}});
const list=(name:string,title:string,fields:any[])=>defineField({name,title,type:'array',of:[{type:'object',fields}]});
export const siteSettings=defineType({name:'siteSettings',title:'Treści strony',type:'document',fields:[
 text('name','Nazwa firmy'),text('person','Imię i nazwisko'),
 text('heroTitle','Nagłówek główny (nowa linia dzieli wiersze)','text'),text('heroDescription','Opis strony głównej','text'),
 text('aboutTitle','Nagłówek O mnie','text'),defineField({name:'biography',title:'Biografia — akapity',type:'array',of:[{type:'text'}]}),
 text('location','Lokalizacja'),text('address','Pełny adres'),text('phone','Telefon'),text('email','E-mail'),
 ...['booksyUrl','googleUrl','facebookUrl'].map(name=>defineField({name,title:name,type:'url',validation:Rule=>Rule.uri({scheme:['https']})})),
 image('heroImage','Zdjęcie główne'),image('portraitImage','Portret Kamila'),image('clinicImage','Gabinet'),
 list('services','W czym pomagam',[text('title','Tytuł'),text('description','Opis','text')]),
 list('methods','Terapie i współpraca',[text('title','Tytuł'),text('description','Opis','text')]),
 list('credentials','Potwierdzone wykształcenie i certyfikaty',[text('title','Kwalifikacja'),text('institution','Organizator / uczelnia'),text('year','Rok')]),
 list('reviews','Opinie — tylko zweryfikowane i dopuszczone do publikacji',[text('name','Podpis'),text('text','Treść','text')]),
 text('rating','Potwierdzona ocena Booksy'),text('reviewCount','Liczba opinii'),
 defineField({name:'privacyText',title:'Zatwierdzona polityka prywatności — akapity',type:'array',of:[{type:'text'}]}),
 defineField({name:'privacyApproved',title:'Polityka zatwierdzona; gotowość do indeksowania',type:'boolean',initialValue:false,description:'Zaznacz dopiero po weryfikacji danych, polityki i konfiguracji hostingu.'})
]});
