# ZöldPont Irodakert – bemutató weboldal (fiktív vállalkozás)

Magyar nyelvű, mobilbarát, statikus bemutatkozó oldal egy **kitalált** irodai növénygondozó vállalkozásnak. Az oldalon minden cég-, ügyfél- és kapcsolati adat, ár és szám fiktív; ezt minden oldal tetején egy sáv és a lábléc is jelzi.

A tartalmi terv és az elfogadási feltételek: [`docs/TERV.md`](docs/TERV.md).

## Felépítés

```
site/                      ← ezt kell közzétenni (Cloudflare Pages kimeneti könyvtár)
  index.html               Főoldal
  szolgaltatasok.html      Szolgáltatások, csomagok, GYIK
  projektek.html           4 fiktív esettanulmány, szűrővel
  rolunk.html              Történet, értékek, csapat, működési terület
  kapcsolat.html           Bemutató ajánlatkérő űrlap, impresszum, adatkezelés
  404.html                 Hibaoldal (Cloudflare Pages automatikusan használja)
  _headers                 Biztonsági fejlécek (CSP stb.), noindex, cache
  robots.txt               Keresőrobotok kizárása
  assets/css/style.css     Közös stíluslap (mobil-első, CSS-változókkal)
  assets/js/main.js        Mobilmenü, projektszűrő, űrlap-ellenőrzés
  assets/img/*.svg         Saját illusztrációk, logó
tests/
  server.mjs               Helyi kiszolgáló, amely a Cloudflare Pages viselkedését utánozza
  check.mjs                Automatikus elfogadási ellenőrzés (Playwright)
docs/TERV.md               Oldaltérkép, tartalmi terv, elfogadási feltételek
```

Nincs build lépés és nincs futásidejű függőség: tiszta HTML, CSS és JavaScript. Az oldal nem tölt be külső betűtípust, szkriptet vagy analitikát, és nem használ sütit.

## Helyi futtatás

```bash
node tests/server.mjs 8080
```

Ezután nyissa meg: <http://localhost:8080>. A kiszolgáló a Cloudflare Pages-hez hasonlóan kezeli a kiterjesztés nélküli útvonalakat (`/kapcsolat`), a 404-es oldalt és a `_headers` fájlt.

Megjegyzés: a linkek gyökérrelatívak (`/kapcsolat`), ezért az oldal közvetlenül fájlból (`file://`) megnyitva nem működik helyesen. Mindig kiszolgálón keresztül nézze meg.

## Ellenőrzés

```bash
node tests/check.mjs
```

Előfeltétel: Node.js 18+ és Playwright Chromiummal:

```bash
npm i -D playwright
```

```bash
npx playwright install chromium
```

A szkript a `docs/TERV.md` ✱ jelölésű elfogadási feltételeit ellenőrzi (oldalszám, fiktivitási jelölések, vízszintes görgetés 320–1440 px között, címsorok, menü, JS nélküli működés, űrlap, szűrő, konzolhibák, linkek, külső kérések, oldalméret, fejléc- és láblécegyezés, egyedi azonosítók, 404). Sikertelenség esetén 1-es kilépési kóddal áll le.

A szkript nem ellenőrzi:
- **Q1, W3C HTML-validáció:** <https://validator.w3.org/nu/>, vagy helyben a `vnu-jar` npm-csomaggal: `java -jar vnu.jar --skip-non-html --also-check-css --also-check-svg site`.
- **Q5, Lighthouse:** Chrome DevTools → Lighthouse → Mobile. A SEO-kategória „Page is blocked from indexing” jelzése szándékos (noindex).
- **A2, A7, M2–M4:** kézi ellenőrzés a terv szerint (billentyűzetes bejárás, csökkentett mozgás, nagyítás).

## Közzététel Cloudflare Pagesen

**A) Git-integráció.** Töltse fel a projektet egy GitHub- vagy GitLab-tárolóba, majd a Cloudflare irányítópultján: *Workers & Pages → Create → Pages → Connect to Git*. Itt válassza ki a tárolót, és állítsa be a következőket:

| Beállítás | Érték |
|-----------|-------|
| Framework preset | None |
| Build command | *(üres)* |
| Build output directory | `site` |

**B) Közvetlen feltöltés.** Az irányítópulton: *Workers & Pages → Create → Pages → Upload assets*, majd töltse fel a `site` mappát. Ugyanez parancssorból:

```bash
npx wrangler pages deploy site --project-name zoldpont-irodakert
```

Közzététel után az élő URL-en ellenőrizze a következőket:
- `/kapcsolat` betölt;
- egy nem létező útvonal a 404-es oldalt adja;
- a `curl -I https://<projekt>.pages.dev/` válaszában szerepelnek a `_headers` fejlécei (Q7, Q8).

## Karbantartás

- **Közös fejléc és lábléc:** mind a hat HTML-fájlban szerepel, mert nincs build lépés. Módosításkor mindegyikben frissíteni kell; a `check.mjs` X1-es ellenőrzése jelzi, ha eltérnek. Az egyetlen megengedett eltérés az aktív menüpont `aria-current="page"` jelölése.
- **Új kép:** a `site/assets/img` mappába kerüljön, `width`/`height` attribútummal és értelmes `alt` szöveggel (dekoratív kép esetén `alt=""`).
- **Inline stílus és szkript:** nem használható, mert a CSP (`_headers`) tiltja. Minden stílus a `style.css`-be, minden szkript a `main.js`-be kerüljön.
- **Színek:** a `style.css` elején, CSS-változókként vannak megadva. Szöveghez legalább 4,5:1 kontrasztot kell tartani.
- **Valódi űrlapküldés:** ha később szükség lesz rá, egy Cloudflare Pages Function (`functions/` mappa) és egy e-mail-szolgáltatás kell hozzá. Ekkor a `main.js` bemutató-visszajelzését, a `connect-src`/`form-action` CSP-beállítást és az adatkezelési szöveget is frissíteni kell.
