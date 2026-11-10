# ZöldPont Irodakert – projektterv

> **Fiktív vállalkozás.** A ZöldPont Irodakert, valamint a mintaprojektekben szereplő ügyfelek, személyek, címek, telefonszámok, árak és számadatok kitaláltak. Az oldal bemutató és oktatási céllal készül.

Állapot: **jóváhagyva és megvalósítva** · Dátum: 2026-11-10

Jóváhagyott döntések (a 7. pont kérdéseire): az 5 oldalas szerkezet marad; fiktív, jelölt csomagárak szerepelnek; az űrlap csak bemutató; az indexelés tiltva (noindex + robots.txt); saját SVG-illusztrációk; ellenőrző szkript készül. A közzététel módja (Git vagy közvetlen feltöltés) nyitott; mindkettő leírása a README-ben.

---

## 1. Célok és célközönség

**Cél:** a látogató 1–2 perc alatt értse meg, mit csinál a ZöldPont (tervez, telepít, gondoz), lássa, hogy hasonló cégeknél már működött, és könnyen kérjen ingyenes helyszíni felmérést.

**Célközönség:** budapesti kkv-k (5–80 fős irodák) döntéshozói: ügyvezető, irodavezető, office manager, HR. Jellemző kérdéseik: *Mennyibe kerül? Mennyi munkánk lesz vele? Mi van, ha elszárad? Belefér-e a mi irodánkba?*

**Hangnem:** közvetlen, szakértő, de nem tudálékos; magázó („Önök”), rövid bekezdések, kevés szakszó, konkrétumok.

---

## 2. Oldaltérkép (5 oldal)

```
Főoldal  (/)                       index.html
├── Szolgáltatások (/szolgaltatasok)  szolgaltatasok.html
├── Mintaprojektek (/projektek)       projektek.html
├── Rólunk (/rolunk)                  rolunk.html
└── Kapcsolat (/kapcsolat)            kapcsolat.html

Technikai (nem tartalmi oldal): 404.html – Cloudflare Pages automatikusan ezt adja vissza nem létező útvonalra.
```

- A Cloudflare Pages a `.html` kiterjesztés nélküli útvonalakat (`/kapcsolat`) automatikusan kiszolgálja.
- Főmenü minden oldalon: Szolgáltatások · Mintaprojektek · Rólunk · Kapcsolat + kiemelt gomb: **Ingyenes felmérést kérek**.
- Lábléc minden oldalon: rövid cégleírás, fiktív elérhetőségek, menü, **fiktivitási nyilatkozat**, impresszum és adatkezelési rövid tájékoztató (a Kapcsolat oldal horgonyaira mutat, így nem kell külön oldal).

---

## 3. Oldalankénti tartalmi terv

### 3.1 Főoldal – `index.html`

| # | Szakasz | Tartalom (mintaszöveg-irány) |
|---|---------|------------------------------|
| 0 | Fiktivitási sáv | Vékony sáv az oldal tetején: „Bemutató oldal – a ZöldPont Irodakert fiktív vállalkozás.” |
| 1 | Hero | Cím: **„Zöld iroda, gond nélkül.”** Alcím: „Megtervezzük, beültetjük és gondozzuk irodája növényeit – Önnek csak élveznie kell őket.” CTA: *Ingyenes felmérést kérek* / *Mintaprojektek* . Illusztráció: SVG levélmotívum. |
| 2 | Három lépés | Tervezés → Telepítés → Gondozás, egy-egy mondattal és ikonnal, link a Szolgáltatásokra. |
| 3 | Miért érdemes? | 3–4 előny tárgyszerűen: kellemesebb munkakörnyezet, akusztikai és térelválasztó szerep, reprezentatív ügyféltér, nulla adminisztráció. Állítások óvatos megfogalmazással, egészségügyi ígéret nélkül. |
| 4 | Kiemelt mintaprojektek | 3 kártya (kép/illusztráció, ügyfél, kerület, egy mondatos eredmény) → Mintaprojektek. |
| 5 | Számok | Fiktív, jelölt adatok: pl. „140+ gondozott iroda”, „3 400 növény”, „98% növénymegtartás” – mellette apró „fiktív adat” jelölés. |
| 6 | Ügyfélvélemény | 1 idézet fiktív személytől, fiktív cégtől. |
| 7 | Záró CTA | „Kíváncsi, mi férne el az Önök irodájában? 45 perces ingyenes felmérés, kötelezettség nélkül.” |

### 3.2 Szolgáltatások – `szolgaltatasok.html`

1. **Bevezető** – kinek szól, hogyan dolgozunk (fényviszony, hőmérséklet, irodai szokások felmérése).
2. **Tervezés** – helyszíni felmérés, fénymérés, növény- és kaspóválasztás, látványterv, árajánlat. *Eredmény: írásos koncepció 5 munkanapon belül.*
3. **Telepítés** – szállítás, beültetés, önöntöző kaspók, térelválasztó növényládák, mohafal/zöldfal; munkaidőn kívüli kivitelezés lehetősége.
4. **Gondozás** – kéthetente vagy havonta: öntözés, tápanyag, metszés, levéltisztítás, kártevő-ellenőrzés, **cseregarancia**.
5. **Növénybérlés** – telepítés + gondozás havidíjas csomagban, beruházási költség nélkül.
6. **Csomagok** – 3 kártya (pl. *Csíra*, *Hajtás*, *Lombkorona*), „-tól” jellegű, **fiktív és tájékoztató** árakkal (lásd 7. nyitott kérdés).
7. **Folyamat** – számozott lépések: kapcsolatfelvétel → felmérés → ajánlat → telepítés → gondozás.
8. **GYIK** – 5–6 kérdés natív `<details>` elemmel (pl. „Mi történik, ha egy növény elpusztul?”, „Kell-e nekünk öntözni?”, „Ablaktalan tárgyalóba is tudnak növényt tenni?”, „Allergiások is vannak a csapatban – mire figyelnek?”).
9. **CTA** a Kapcsolat oldalra.

### 3.3 Mintaprojektek – `projektek.html`

Bevezető + szűrő (Összes / Tervezés+telepítés / Gondozás / Zöldfal) – JS nélkül minden projekt látszik.

Négy fiktív esettanulmány azonos szerkezetben: **Kiinduló helyzet → Megoldás → Eredmény**, mellette adatdoboz (kerület, alapterület, létszám, növények száma, átfutási idő, szolgáltatás).

| Fiktív ügyfél | Helyszín | Feladat röviden |
|---------------|----------|-----------------|
| Kódkert Kft. (szoftverfejlesztés, 28 fő) | XIII. ker., irodaház | Zajos nyitott iroda: guruló növényládás térelválasztók, 42 növény, kéthetes gondozás. |
| Pagony Könyvelőiroda (9 fő) | VI. ker., belvárosi bérház | Kevés természetes fény: árnyéktűrő fajok + növénylámpás polc, 14 növény. |
| Rakpart Cowork (közösségi iroda) | XI. ker. | Recepciós mohafal (stabilizált moha, öntözést nem igényel) + 30 asztali növény, bérléses csomagban. |
| Fénytörés Építészstúdió (12 fő) | II. ker., villaépület | Meglévő, elhanyagolt növényállomány felújítása és havi gondozás; 70% megmentve. |

Képek: projektenként egyedi, stilizált SVG-illusztráció (alaprajz-/növényrajz-hatású) – nincs fotólicenc-kockázat.

### 3.4 Rólunk – `rolunk.html`

1. **Történetünk** – 2019-ben alapította két kertészmérnök (fiktív), mert az irodai növények többsége fél éven belül elpusztult.
2. **Értékeink** – helyben nevelt vagy magyar termelőtől származó növények; tőzegmentes közeg; újrahasznosított kaspók; elektromos kisteherautó belvárosi kiszállításhoz.
3. **Csapat** – 3–4 fiktív munkatárs: monogramos/illusztrált avatar (nem fotó), név, szerep, egy személyes mondat („kedvenc irodai növénye”).
4. **Működési terület** – Budapest minden kerülete, egyeztetéssel Budaörs, Törökbálint, Szentendre (sematikus, nem valós térkép).
5. **CTA**.

### 3.5 Kapcsolat – `kapcsolat.html`

1. **Bevezető** – „Írjon nekünk, és 1 munkanapon belül visszajelzünk.”
2. **Ajánlatkérő űrlap** – név*, cégnév*, e-mail*, telefon, iroda mérete (választólista), létszám, érdeklődés (jelölőnégyzetek: tervezés, telepítés, gondozás, bérlés), üzenet, adatkezelési hozzájárulás*.
   - Kliensoldali ellenőrzés magyar hibaüzenetekkel.
   - **Az űrlap nem küld adatot sehova**; beküldéskor egyértelmű visszajelzés: „Köszönjük! Ez egy bemutató oldal, így üzenete nem került továbbításra.”
3. **Elérhetőségek** (fiktív): `hello@zoldpont-irodakert.example`, +36 1 000 0000 (formátumban jelölten fiktív), „1000 Budapest, Minta utca 1.” – mindenhol „fiktív” címkével.
4. **Nyitvatartás / ügyfélszolgálat** – H–P 8–17.
5. **Impresszum** (`#impresszum`) – fiktív cégadatok, egyértelmű jelöléssel.
6. **Adatkezelési tájékoztató – röviden** (`#adatkezeles`) – az oldal nem gyűjt adatot, nem használ sütit, analitikát és külső betűtípust.

### 3.6 404 – `404.html`

„Ez a cserép üres.” – rövid szöveg, link a főoldalra és a menüpontokra.

---

## 4. Arculat

| Elem | Javaslat |
|------|----------|
| Színek | Mohazöld `#2F5D3A` (elsődleges), zsályazöld `#8FA98A`, krém háttér `#F6F1E7`, agyag/terrakotta kiemelés `#9A4E2C` (szövegre), sötét szöveg `#1F2A22` |
| Tipográfia | Címsorok: rendszer-serif (Iowan Old Style / Palatino / Georgia); szöveg: rendszer sans-serif. Nincs külső betűtípus → gyors és adatvédelmileg tiszta. |
| Formák | Lekerekített sarkok, organikus „levél” alakú dekorelemek, finom papírszerű háttérminta (CSS/SVG). |
| Képi világ | Saját, inline SVG illusztrációk és ikonok; nincs stockfotó. |
| Logó | Egyszerű szöveges logó + levél-pont szimbólum (SVG), favicon ugyanebből. |
| Mozgás | Csak finom átmenetek; `prefers-reduced-motion` esetén kikapcsolva. |
| Sötét mód | Nem része a terjedelemnek (opcionálisan bővíthető). |

---

## 5. Fejlesztői dokumentáció (röviden)

### 5.1 Technológia

- Tiszta **HTML5 + CSS + vanilla JavaScript**, build lépés és függőség nélkül.
- Mobil-első reszponzív CSS (CSS custom properties, Flexbox/Grid, `clamp()` alapú tipográfia). Töréspontok: 600 px, 900 px, 1200 px.
- JS csak progresszív kiegészítés: mobilmenü, projektszűrő, űrlap-ellenőrzés, aktuális év a láblécben. JS nélkül minden tartalom elérhető.
- Böngészőtámogatás: az utolsó 2 verzió (Chrome, Edge, Firefox, Safari), iOS Safari 16+, Android Chrome.

### 5.2 Könyvtárszerkezet

```
zoldpont-irodakert/
├── site/                  ← Cloudflare Pages kimeneti könyvtár
│   ├── index.html
│   ├── szolgaltatasok.html
│   ├── projektek.html
│   ├── rolunk.html
│   ├── kapcsolat.html
│   ├── 404.html
│   ├── _headers           ← biztonsági és gyorsítótár-fejlécek
│   ├── robots.txt
│   ├── assets/
│   │   ├── css/style.css
│   │   ├── js/main.js
│   │   └── img/           ← SVG illusztrációk, logó, favicon
├── tests/check.mjs        ← automatikus ellenőrző szkript (Playwright)
├── docs/TERV.md           ← ez a dokumentum
└── README.md              ← futtatás, ellenőrzés, közzététel
```

A közös fejléc/lábléc a build lépés elkerülése érdekében minden HTML-fájlban szerepel; a README rögzíti, hogy módosításkor mind az öt (+404) fájlban frissíteni kell (a `tests/check.mjs` ellenőrzi az egyezést).

### 5.3 Helyi futtatás

```bash
node tests/server.mjs 8080   # Cloudflare Pages-szerű útvonalkezeléssel
```

### 5.4 Közzététel Cloudflare Pagesen

**A) Git-integráció:** Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git; *Framework preset:* None, *Build command:* üres, *Build output directory:* `site`.

**B) Közvetlen feltöltés:** Dashboard → Pages → Upload assets → a `site` mappa feltöltése, vagy:

```bash
npx wrangler pages deploy site --project-name zoldpont-irodakert
```

`_headers` tartalma: `Content-Security-Policy` (csak saját forrás), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Robots-Tag: noindex` (ha a fiktív oldal indexelését tiltjuk), valamint hosszabb cache az `/assets/*` útvonalra.

### 5.5 Ellenőrzés

`node tests/check.mjs` – helyi szervert indít, és Playwrighttal végigjárja az oldalakat (vízszintes görgetés, konzolhibák, belső linkek, kötelező elemek, külső kérések, fejléc/lábléc egyezés). Kiegészítő kézi ellenőrzés: W3C HTML-validátor, Lighthouse (mobil), billentyűzetes bejárás.

---

## 6. Elfogadási feltételek

Minden pont igen/nem alapon ellenőrizhető. Az ✱ jelölésűeket a `tests/check.mjs` automatikusan ellenőrzi.

### Terjedelem és tartalom

| ID | Feltétel | Ellenőrzés módja |
|----|----------|------------------|
| T1 ✱ | Pontosan 5 tartalmi HTML-oldal van (+ `404.html`). | Fájllista |
| T2 ✱ | Minden oldalon megjelenik a fiktivitási sáv a fejléc felett **és** a fiktivitási nyilatkozat a láblécben. | DOM-ellenőrzés |
| T3 | Minden kitalált adat (elérhetőség, ár, statisztika) mellett látható „fiktív” jelölés. | Kézi átnézés |
| T4 | Nincs „Lorem ipsum” vagy helyőrző szöveg; minden szakasz kidolgozott magyar mintaszöveg. | `grep -ri lorem site/` = 0 találat + átolvasás |
| T5 ✱ | Minden oldalon `lang="hu"`, egyedi `<title>` és `meta description`. | DOM-ellenőrzés |
| T6 | A szolgáltatások (tervezés, telepítés, gondozás, bérlés), legalább 3 mintaprojekt és a kapcsolatfelvétel bemutatásra kerül. | Kézi átnézés |

### Mobil és megjelenés

| ID | Feltétel | Ellenőrzés módja |
|----|----------|------------------|
| M1 ✱ | 320, 375, 768, 1024 és 1440 px szélességen nincs vízszintes görgetés. | `scrollWidth <= clientWidth` |
| M2 | Mobilon minden kattintható elem legalább 44×44 px. | Lighthouse / kézi |
| M3 | Szövegek kontrasztja legalább 4,5:1 (nagy szövegnél 3:1). | Lighthouse / kontrasztmérő |
| M4 | Az oldal 200%-os nagyításon is használható, tartalom nem vész el. | Kézi |

### Akadálymentesség és működés

| ID | Feltétel | Ellenőrzés módja |
|----|----------|------------------|
| A1 ✱ | Oldalanként egy `<h1>`, a címsorhierarchia nem ugrik szintet. | DOM-ellenőrzés |
| A2 | „Ugrás a tartalomra” link, látható fókuszjelzés, teljes billentyűzetes bejárhatóság. | Kézi (Tab) |
| A3 ✱ | A mobilmenü gomb `aria-expanded` értéke a nyitott/zárt állapotot követi; Esc bezárja. | Playwright |
| A4 ✱ | JavaScript kikapcsolásával is elérhető minden oldal és minden projekt. | Playwright `javaScriptEnabled: false` |
| A5 ✱ | Üres kötelező mezőkkel beküldve az űrlap magyar hibaüzenetet ad a mezőnél (`aria-describedby`), és nem jelez sikert. | Playwright |
| A6 ✱ | Helyesen kitöltve beküldéskor megjelenik a „bemutató oldal, nem továbbítottuk” visszajelzés, és nem indul hálózati kérés. | Playwright (hálózatfigyelés) |
| A7 | Mozgások `prefers-reduced-motion: reduce` esetén kikapcsolnak. | DevTools emuláció |
| A8 ✱ | A projektszűrő a kiválasztott kategória projektjeit mutatja, „Összes” mindent. | Playwright |

### Minőség, teljesítmény, közzététel

| ID | Feltétel | Ellenőrzés módja |
|----|----------|------------------|
| Q1 | W3C Nu HTML-validátor: 0 hiba minden oldalon. | validator.w3.org/nu |
| Q2 ✱ | Nincs konzolhiba egyik oldalon sem. | Playwright |
| Q3 ✱ | Minden belső link és erőforrás 200-as választ ad (a 404-teszt kivételével). | Playwright |
| Q4 ✱ | Nincs külső hálózati kérés (betűtípus, CDN, analitika, süti). | Playwright kérésfigyelés |
| Q5 | Lighthouse mobil: Teljesítmény ≥ 90, Akadálymentesség ≥ 95, Bevált gyakorlatok ≥ 95. (A SEO-pontszámot a szándékos noindex rontja, ezért nem feltétel.) | Lighthouse |
| X1 ✱ | A közös fejléc és lábléc minden oldalon azonos (az aktív menüpont jelölésén kívül). | Playwright |
| X2 ✱ | Nem létező útvonal 404-es státusszal a 404 oldalt adja. | Playwright |
| X3 ✱ | Az `id` értékek oldalanként egyediek. | Playwright |
| Q6 ✱ | Egy oldal teljes letöltött mérete ≤ 300 KB. | Playwright |
| Q7 | Cloudflare Pagesre build parancs nélkül, `site` kimeneti könyvtárral telepíthető; `/kapcsolat` és `/nemletezik` (→ 404 oldal) helyesen működik az élő URL-en. | Élő ellenőrzés |
| Q8 | A `_headers` fejlécek megjelennek az élő oldal válaszában. | `curl -I <url>` |

---

## 7. Nyitott kérdések (egyeztetendő)

1. **Oldalszerkezet:** megfelel a fenti 5 oldal (Főoldal, Szolgáltatások, Mintaprojektek, Rólunk, Kapcsolat)? A GYIK a Szolgáltatások oldalon kap helyet.
2. **Árak:** szerepeljenek fiktív, „-tól” jellegű csomagárak, vagy csak „egyedi ajánlat alapján”?
3. **Űrlap:** maradjon tisztán bemutató (nem küld adatot) – vagy legyen valódi beküldés (pl. Cloudflare Pages Function + e-mail szolgáltatás)?
4. **Indexelés:** tiltsuk a keresőket (`noindex` + `robots.txt`), hogy a fiktív cég ne jelenjen meg a találatok között? (Javaslat: igen.)
5. **Képi világ:** megfelelnek a saját SVG-illusztrációk, vagy lesznek saját (licencelt) fotók?
6. **Verziókezelés és közzététel:** Git-integrációval (GitHub-repó szükséges) vagy közvetlen feltöltéssel kerül Cloudflare Pagesre?
7. **Ellenőrző szkript:** kéri a `tests/check.mjs` automatikus tesztet, vagy elég a kézi ellenőrzőlista?
