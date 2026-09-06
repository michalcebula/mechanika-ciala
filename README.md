# mechanika-ciala

profile page for physioteraphist

## Astro + Sanity

Pierwsza implementacja strony Mechanika Ciała Kamil Szuwalski na podstawie zaakceptowanych makiet. Statyczne HTML, responsywny CSS, lokalne zdjęcia i font Manrope. Brak Next.js oraz JavaScriptu aplikacyjnego po stronie przeglądarki.

### Uruchomienie

Node 22.12+ (sprawdzone na Node 24), npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm test
```

### Sanity

1. W swoim koncie Sanity utwórz projekt i dataset; nie są tworzone automatycznie.
2. Skopiuj `.env.example` do `.env`, uzupełnij identyfikator i dataset. Dla prywatnego datasetu użyj tokenu **tylko do odczytu**, nigdy tokenu edycji.
3. W `studio/` skopiuj `.env.example` do `.env` i wpisz te same wartości.
4. Uruchom `npm install` i `npm run dev` w `studio/`, zaloguj się w Sanity i opublikuj jeden dokument „Treści strony”.
5. Wypełnij treści, dane kontaktowe, kwalifikacje, zatwierdzone opinie i zdjęcia. Nieobecne pola korzystają z lokalnej wersji roboczej. Puste listy kwalifikacji i opinii nie są wyświetlane.
6. Po publikacji w Sanity wykonaj ponownie `npm run build` i wgraj nowy `dist/`. Automatyzacja przebudowania / webhook nie jest jeszcze skonfigurowana.

Treści Sanity pobierane są wyłącznie podczas budowania. Token nie trafia do przeglądarki. Błąd CMS przerywa build zamiast publikować nieaktualną wersję. Bez konfiguracji Sanity strona działa na danych roboczych z `src/lib/content.ts`.

### OVH

Statyczny wynik znajduje się w `dist/`. Po zakupie domeny ustaw `SITE_URL=https://twoja-domena.pl` na etapie budowania. Wgraj **zawartość** `dist/` do katalogu WWW w wybranym hostingu OVH. Serwer powinien obsługiwać `index.html` w podkatalogach i własny `404.html`. Nie używaj przekierowania wszystkich ścieżek do głównego index.html (to nie SPA). Włącz HTTPS i przekierowanie na jedną wersję domeny. Zachowaj poprzednią wersję do rollbacku. Nie przesyłaj `.env`, kodu Studio ani node_modules do publicznego katalogu.

Hosting OVH, domena oraz pipeline wdrożeniowy nie zostały utworzone ani zmienione. Nie zmieniamy docelowego dostawcy na Sites.

### Publikacja — lista braków

- Potwierdzić opisy usług, metody, biografię, uprawnienia i kwalifikacje z Kamilem.
- Uzupełnić pełny adres, telefon i e-mail; nie używać fikcyjnych danych z makiety.
- Wstawić prawdziwe opinie i aktualną ocenę tylko po weryfikacji oraz ustaleniu możliwości ich ponownej publikacji.
- Potwierdzić prawa do publikacji fotografii i wizerunków pacjentów. Zdjęcia pochodzą z folderu udostępnionego przez użytkownika, nie są wygenerowane przez AI.
- Zatwierdzić pełną politykę prywatności odpowiadającą faktycznym procesom i hostingowi.
- Ustawić `privacyApproved` w CMS po zatwierdzeniu polityki; wraz z SITE_URL odblokowuje indeksowanie. Do tego czasu meta robots i robots.txt blokują indeksowanie (nie są kontrolą dostępu).
- Kalendarz Booksy zastąpiono działającym linkiem do profilu. Prawdziwy widget wymaga oficjalnego kodu osadzenia i oceny cookies, nie wyświetlamy pozornego kalendarza.
- Mapa Google jest obecnie linkiem. Osadzenie wymaga zweryfikowanego miejsca i mechanizmu zgody; nie używamy fikcyjnej mapy.
- Sprawdzić wygląd na telefonach, klawiaturę, powiększenie tekstu i rzeczywiste przepływy Booksy przed publikacją. W tej iteracji wykonano weryfikację kompilacji, typów i plików, nie testy przeglądarkowe.

### Źródła

- Dokumentacja Astro: https://docs.astro.build/en/guides/deploy/
- Dokumentacja Sanity: https://www.sanity.io/docs

Fotografie pochodzą z materiałów przekazanych przez właściciela projektu; twarze i sceny pozostają oryginalne.
