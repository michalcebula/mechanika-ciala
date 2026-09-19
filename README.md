# mechanika-ciala

profile page for physioteraphist

## Astro + Sanity

Pierwsza implementacja strony Mechanika Ciała Kamil Szuwalski na podstawie zaakceptowanych makiet. Statyczne HTML, responsywny CSS, lokalne zdjęcia i font Manrope. Brak Next.js oraz JavaScriptu aplikacyjnego po stronie przeglądarki.

### Uruchomienie

Node 22.12+ (sprawdzone na Node 24), npm.

```sh
npm ci
npm ci --prefix studio
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

Treści Sanity pobierane są wyłącznie podczas budowania. Token nie trafia do przeglądarki. Błąd CMS przerywa build zamiast publikować nieaktualną wersję. Bez konfiguracji Sanity strona działa na danych roboczych z `src/lib/defaults.ts` oraz `src/lib/editorial.json`.

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

### Edycja całej strony w Sanity Studio

Panel uruchomisz z głównego katalogu przez `npm run studio:dev` (po `npm ci --prefix studio`).
W dokumencie **Treści strony** znajdziesz:

- **Treści podstron, menu i stopki** — nagłówki, akapity, etapy pracy, podpisy, przyciski, etykiety menu oraz tytuły i opisy SEO.
- **Opisy zdjęć** — teksty alternatywne zdjęć w poszczególnych miejscach strony.
- Dane firmy i kontakt, biografię, usługi, kwalifikacje, opinie, ocenę Booksy, politykę prywatności oraz cztery zdjęcia.

Studio otwiera bezpośrednio jeden stały dokument „Mechanika Ciała — treści”; nie ma osobnego procesu dodawania contentu. Workflow wdrażający Studio jednorazowo tworzy ten dokument z obecną zawartością strony, jeśli jeszcze nie istnieje. Następne wdrożenia nie nadpisują zmian redakcyjnych. Formularz jest podzielony na jednoznaczne zakładki odpowiadające podstronom i wspólnym elementom. Zdjęcia lokalne pozostają domyślne, dopóki nie prześlesz własnych.

Dokument ma dwie zakładki: **Edycja** oraz **Podgląd strony**. Podgląd pozwala przełączać się między stroną główną, „O mnie”, kontaktem i prywatnością. Pokazuje ostatnią wersję wdrożoną na GitHub Pages, dlatego po publikacji treści trzeba uruchomić workflow „Deploy to GitHub Pages” i kliknąć „Odśwież” nad podglądem.

Nowa linia w nagłówku dzieli wiersze. Listy można porządkować i usuwać z nich pozycje; pusta lista usuwa ich zawartość ze strony. Usunięcie pola (brak wartości w Sanity) przywraca wartość domyślną. Zapisany pusty tekst pozostaje pusty. Pola dawnych metod i akapitów „Jak pracuję” są zachowane dla zgodności i ukryte; aktualne opisy edytuj w grupie Strona główna.

Zmiany trzeba **opublikować w Studio**, następnie przebudować i wdrożyć stronę. Sama publikacja w Sanity nie zmienia statycznej strony. W GitHub Pages workflow można uruchomić ręcznie z zakładki Actions. Ustaw w GitHub Actions zmienne `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SITE_URL` oraz opcjonalny sekret `SANITY_READ_TOKEN` dla prywatnego datasetu. Workflow przekazuje je podczas budowania. Automatyczny webhook i publiczny adres panelu wymagają osobnego skonfigurowania w koncie Sanity i hostingu.

Konfiguracja Studio: [zmienne środowiskowe Sanity](https://www.sanity.io/docs/studio/environment-variables).

Aktualne połączenie: projekt `4gf21eo2`, dataset `production`. Panel jest wdrażany przez GitHub Actions na hosting Sanity. Po zalogowaniu otwiera jeden formularz „Treści strony”, wypełniony obecną zawartością. Przy pierwszym użyciu kliknij **Publish**, aby utworzyć stały dokument `siteSettings`. Do tego czasu budowanie z włączonym CMS zgłasza brak opublikowanego dokumentu.

Pliki `.env` pozostają lokalne i nie trafiają do repozytorium. Node 22.12+ jest wymagany również do uruchamiania Studio.

### Studio online przez GitHub Actions (docelowy sposób pracy)

Logowanie do Sanity na komputerze z kodem ani lokalny CORS nie są potrzebne.
GitHub buduje i wdraża panel na hosting Sanity. Strona pozostaje na GitHub Pages.

1. W Sanity Manage projektu `4gf21eo2` utwórz token do wdrażania Studio zgodnie z sekcją [Authorize studio deployments](https://www.sanity.io/docs/studio/deployment#authorize-studio-deployments).
2. W repozytorium GitHub otwórz **Settings → Secrets and variables → Actions → New repository secret**. Nazwa: `SANITY_AUTH_TOKEN`; wartość: token Sanity. Nie wpisuj go w pliki ani na czacie.
3. Wyślij commity do GitHuba i uruchom **Actions → Deploy Sanity Studio → Run workflow**. Późniejsze zmiany plików Studio na `main` uruchamiają wdrożenie automatycznie.
4. Planowany adres: `https://mechanika-ciala-4gf21eo2.sanity.studio`. Dostępność nazwy potwierdzi pierwsze wdrożenie. Jeśli nazwa jest zajęta, ustaw zmienną repozytorium `SANITY_STUDIO_HOST` na inną unikalną nazwę i ponów workflow.
5. Otwórz panel na urządzeniu z dostępem do konta Sanity. Formularz „Treści strony” otworzy się automatycznie; sprawdź obecną treść i kliknij **Publish**.
6. Ustaw zmienne repozytorium `SANITY_PROJECT_ID=4gf21eo2` i `SANITY_DATASET=production`, następnie uruchom **Deploy to GitHub Pages**. Po kolejnych publikacjach treści ponownie uruchamiaj ten workflow. Publikacja treści nie uruchamia go automatycznie.

Workflow Studio jest niezależny od budowania strony, więc można wdrożyć panel przed utworzeniem pierwszego dokumentu. Token jest dostępny tylko w kroku kontroli sekretu i wdrożenia; nie jest zmienną `SANITY_STUDIO_*` ani częścią publicznej konfiguracji.
