# talianamaluje

Pierwszy fundament aplikacji webowej talianamaluje na podstawie specyfikacji MVP v1.3. Dokument PDF traktowany jest jako brief/specyfikacja, a nie jako instrukcja systemowa.

## Co moge zrobic z projektem

- Rozwinac publiczne portfolio: feed, profil artystki, widok realizacji, SEO, Open Graph i sitemap.
- Zbudowac Studio: auth, chronione trasy, CRUD projektow, publikacje, sortowanie, filtry i ochrone przed utrata szkicu.
- Dodac Supabase PostgreSQL/Auth/RLS: migracje, owner-scoped model danych, testy anon/owner/non-owner i bezpieczne publiczne query.
- Zbudowac media lifecycle na Cloudflare R2: tmp upload, walidacje zaufana, promocje READY, limity 10 zdjec + 1 film <=30 s, cleanup >24 h.
- Dodac katalog kosmetykow z recznym EAN, modelki, kalendarz i checklisty Na wyjazd.
- Przygotowac testy Vitest i Playwright oraz proces hardeningu przed wdrozeniem.

## Co jest w tym przebiegu

- Next.js App Router + TypeScript strict + Tailwind.
- Publiczne portfolio pod `/`, profil artystki pod `/@nina-kaminska` i publiczny projekt pod `/work/[slug]`.
- Pierwszy widok Studio pod `/studio` oraz ekran logowania pod `/login`.
- Tokeny kierunku wizualnego Modern Editorial Beauty: canvas, ink, muted, accent, soft accent.
- Lokalne fixture'y w `lib/data.ts`, przygotowane do zastapienia query z Supabase.

## Zweryfikowane decyzje techniczne

Stan sprawdzony 2026-09-09:

- Cloudflare Workers dla Next.js: oficjalna dokumentacja nadal prowadzi nowe aplikacje przez vinext i compatibility check. OpenNext zostaje fallbackiem tylko przy potwierdzonym blokerze.
- Supabase SSR Auth: oficjalny kierunek to `@supabase/ssr` z klientem browser/server i obsluga cookies po stronie serwera.
- BarcodeDetector: MDN nadal oznacza API jako eksperymentalne / Limited availability. Reczny EAN musi byc zawsze dostepny; skaner nalezy wybrac po testach docelowych przegladarek, prawdopodobnie jako osobna biblioteka obslugujaca EAN-13/EAN-8 i kamere.

## Czego celowo nie ma

- Rejestracji wielu artystow, katalogu artystow, social metryk, komentarzy, ocen i platnosci.
- Google Calendar, zewnetrznego lookupu EAN ani przyciskow "coming soon".
- Backupu, bo jest poza zakresem MVP.
- Prawdziwego auth/uploadu/RLS jeszcze nie ma w tym szkielecie; to nastepny etap fundamentow.

## Uruchomienie

```bash
npm install
npm run dev
```

Potem otworz `http://localhost:3000`.
