// Automatikus ellenőrzés a docs/TERV.md elfogadási feltételeihez (a ✱ jelölésű pontok).
// Futtatás:  node tests/check.mjs
// Előfeltétel: Node.js 18+ és Playwright Chromiummal (npm i -D playwright && npx playwright install chromium)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { startServer, SITE_DIR } from './server.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROUTES = ['/', '/szolgaltatasok', '/projektek', '/rolunk', '/kapcsolat'];
const EXPECTED_HTML = ['404.html', 'index.html', 'kapcsolat.html', 'projektek.html', 'rolunk.html', 'szolgaltatasok.html'];
const WIDTHS = [320, 375, 768, 1024, 1440];
const MAX_PAGE_BYTES = 300 * 1024;

const failures = new Map();   // id -> [üzenetek]
const descriptions = new Map();
function def(id, desc) { descriptions.set(id, desc); if (!failures.has(id)) failures.set(id, []); }
function fail(id, msg) { failures.get(id).push(msg); }

def('T1', 'Pontosan 5 tartalmi oldal + 404.html');
def('T2', 'Fiktivitási sáv a fejléc felett és nyilatkozat a láblécben');
def('T4', 'Nincs helyőrző szöveg (lorem ipsum, TODO)');
def('T5', 'lang="hu", egyedi <title> és meta description');
def('M1', `Nincs vízszintes görgetés (${WIDTHS.join(', ')} px)`);
def('A1', 'Egy <h1> oldalanként, címsorszint nem ugrik');
def('A3', 'Mobilmenü: aria-expanded követi az állapotot, Esc bezár');
def('A4', 'JavaScript nélkül is elérhető minden oldal és projekt');
def('A5', 'Hibás űrlap: magyar hibaüzenet a mezőnél, nincs siker');
def('A6', 'Helyes űrlap: bemutató-visszajelzés, nincs hálózati kérés');
def('A8', 'Projektszűrő működik');
def('Q2', 'Nincs konzolhiba');
def('Q3', 'Belső linkek és erőforrások elérhetők, horgonyok léteznek');
def('Q4', 'Nincs külső hálózati kérés');
def('Q6', `Oldalméret ≤ ${MAX_PAGE_BYTES / 1024} KB`);
def('X1', 'Fejléc és lábléc minden oldalon egyezik');
def('X3', 'Az azonosítók (id) oldalanként egyediek');
def('X2', 'Nem létező útvonal 404-es státuszt és a 404 oldalt adja');

// ---------- Fájlszintű ellenőrzések ----------
const htmlFiles = fs.readdirSync(SITE_DIR).filter((f) => f.endsWith('.html')).sort();
if (JSON.stringify(htmlFiles) !== JSON.stringify(EXPECTED_HTML)) fail('T1', `talált: ${htmlFiles.join(', ')}`);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
}
for (const file of walk(SITE_DIR)) {
  if (!/\.(html|css|js|svg)$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  if (/lorem ipsum|\bTODO\b|\bFIXME\b/i.test(text)) fail('T4', path.relative(SITE_DIR, file));
}

// ---------- Böngészős ellenőrzések ----------
const server = await startServer(0);
const BASE = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();

function watch(page, label) {
  page.on('console', (m) => { if (m.type() === 'error') fail('Q2', `${label}: ${m.text()}`); });
  page.on('pageerror', (e) => fail('Q2', `${label}: ${e.message}`));
}

try {
  const titles = new Map();
  const descs = new Map();
  const headers = new Map();
  const footers = new Map();
  const links = new Set();

  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await context.newPage();
    watch(page, route);
    let bytes = 0;
    page.on('request', (r) => { if (!r.url().startsWith(BASE) && !r.url().startsWith('data:')) fail('Q4', `${route}: ${r.url()}`); });
    page.on('response', async (r) => { try { bytes += (await r.body()).length; } catch { /* átirányítás */ } });

    const resp = await page.goto(BASE + route, { waitUntil: 'networkidle' });
    if (resp.status() !== 200) fail('Q3', `${route}: HTTP ${resp.status()}`);

    const info = await page.evaluate(() => {
      const bar = document.querySelector('.fiction-bar');
      const header = document.querySelector('.site-header');
      const note = document.querySelector('.site-footer .fiction-note');
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
      const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
      const heads = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => Number(h.tagName[1]));
      return {
        dupIds,
        lang: document.documentElement.lang,
        title: document.title,
        desc: document.querySelector('meta[name="description"]')?.content || '',
        barOk: !!bar && !!header && /fiktív/i.test(bar.textContent) &&
          !!(bar.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING),
        noteOk: !!note && /fiktív/i.test(note.textContent),
        heads,
        header: header?.outerHTML.replace(/ aria-current="page"/g, ''),
        footer: document.querySelector('.site-footer')?.outerHTML,
        links: [
          ...[...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
          ...[...document.querySelectorAll('img[src], script[src]')].map((e) => e.getAttribute('src')),
          ...[...document.querySelectorAll('link[href]')].map((e) => e.getAttribute('href')),
        ],
      };
    });

    if (info.dupIds.length) fail('X3', `${route}: ${info.dupIds.join(', ')}`);
    if (info.lang !== 'hu') fail('T5', `${route}: lang="${info.lang}"`);
    if (!info.title) fail('T5', `${route}: hiányzó title`);
    if (info.desc.length < 50) fail('T5', `${route}: túl rövid vagy hiányzó description`);
    titles.set(route, info.title);
    descs.set(route, info.desc);
    if (!info.barOk) fail('T2', `${route}: fiktivitási sáv hiányzik vagy rossz helyen`);
    if (!info.noteOk) fail('T2', `${route}: lábléc-nyilatkozat hiányzik`);

    const h1s = info.heads.filter((h) => h === 1).length;
    if (h1s !== 1) fail('A1', `${route}: ${h1s} db h1`);
    info.heads.reduce((prev, cur) => {
      if (cur > prev + 1) fail('A1', `${route}: h${prev} után h${cur}`);
      return cur;
    }, 0);

    headers.set(route, info.header);
    footers.set(route, info.footer);
    for (const l of info.links) {
      if (/^(https?:)?\/\//.test(l) || l.startsWith('mailto:') || l.startsWith('tel:')) continue;
      links.add(new URL(l, BASE + route).href.replace(BASE, ''));
    }

    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) fail('M1', `${route} @ ${w}px: +${overflow}px`);
    }

    if (bytes > MAX_PAGE_BYTES) fail('Q6', `${route}: ${(bytes / 1024).toFixed(1)} KB`);
    await context.close();
  }

  if (new Set(titles.values()).size !== ROUTES.length) fail('T5', 'nem egyedi title-ök');
  if (new Set(descs.values()).size !== ROUTES.length) fail('T5', 'nem egyedi description-ök');
  if (new Set(headers.values()).size !== 1) fail('X1', 'eltérő fejléc');
  if (new Set(footers.values()).size !== 1) fail('X1', 'eltérő lábléc');

  // ---------- Q3: belső linkek, horgonyok ----------
  const api = await browser.newContext();
  const htmlCache = new Map();
  for (const link of links) {
    const [p, hash] = link.split('#');
    const target = p || '/';
    if (!htmlCache.has(target)) {
      const r = await api.request.get(BASE + target, { maxRedirects: 0 });
      htmlCache.set(target, { status: r.status(), text: r.status() === 200 ? await r.text() : '' });
    }
    const { status, text } = htmlCache.get(target);
    if (status !== 200) fail('Q3', `${link}: HTTP ${status}`);
    else if (hash && !text.includes(`id="${hash}"`)) fail('Q3', `${link}: nincs ilyen horgony`);
  }

  // ---------- X2: 404 ----------
  {
    const r = await api.request.get(BASE + '/nemletezik-oldal');
    const text = await r.text();
    if (r.status() !== 404 || !text.includes('Ez a cserép üres')) fail('X2', `HTTP ${r.status()}`);
  }
  await api.close();

  // ---------- A3: mobilmenü ----------
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await context.newPage();
    watch(page, 'menü');
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const btn = page.locator('.nav-toggle');
    const firstLink = page.locator('#fomenu a').first();
    if (!(await btn.isVisible())) fail('A3', 'menügomb nem látszik mobilon');
    if ((await btn.getAttribute('aria-expanded')) !== 'false') fail('A3', 'kezdőállapot nem false');
    if (await firstLink.isVisible()) fail('A3', 'zárt menü linkjei látszanak');
    await btn.click();
    if ((await btn.getAttribute('aria-expanded')) !== 'true') fail('A3', 'nyitás után nem true');
    if (!(await firstLink.isVisible())) fail('A3', 'nyitott menü linkjei nem látszanak');
    await page.keyboard.press('Escape');
    if ((await btn.getAttribute('aria-expanded')) !== 'false') fail('A3', 'Esc után nem false');
    if (!(await btn.evaluate((b) => b === document.activeElement))) fail('A3', 'Esc után a fókusz nem a gombon');
    await page.setViewportSize({ width: 1280, height: 800 });
    if (await btn.isVisible()) fail('A3', 'menügomb asztali nézetben is látszik');
    if (!(await firstLink.isVisible())) fail('A3', 'asztali menü nem látszik');
    await context.close();
  }

  // ---------- A4: JavaScript nélkül ----------
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 800 }, javaScriptEnabled: false });
    const page = await context.newPage();
    for (const route of ROUTES) {
      await page.goto(BASE + route);
      const visibleNav = await page.locator('#fomenu a').evaluateAll((as) => as.filter((a) => a.offsetParent !== null).length);
      if (visibleNav < 5) fail('A4', `${route}: csak ${visibleNav} menüpont látszik`);
      const textLen = await page.locator('main').evaluate((m) => m.innerText.length);
      if (textLen < 500) fail('A4', `${route}: kevés tartalom`);
    }
    await page.goto(BASE + '/projektek');
    const projects = await page.locator('.project').evaluateAll((ps) => ps.filter((p) => p.offsetParent !== null).length);
    if (projects !== 4) fail('A4', `/projektek: ${projects} projekt látszik`);
    await context.close();
  }

  // ---------- A5, A6: űrlap ----------
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await context.newPage();
    watch(page, 'űrlap');
    await page.goto(BASE + '/kapcsolat', { waitUntil: 'networkidle' });
    const status = page.locator('#urlap-allapot');
    const submit = page.locator('form [type="submit"]');

    await submit.click();
    if ((await page.locator('#nev').getAttribute('aria-invalid')) !== 'true') fail('A5', 'a név mező nincs hibásnak jelölve');
    const err = (await page.locator('#nev-hiba').textContent()).trim();
    if (!/Kérjük/.test(err)) fail('A5', `hiányzó magyar hibaüzenet: "${err}"`);
    if (!(await page.locator('#nev').getAttribute('aria-describedby')).includes('nev-hiba')) fail('A5', 'aria-describedby hiányzik');
    if (!(await status.getAttribute('class')).includes('error')) fail('A5', 'nincs hibaállapot');
    if (!(await page.locator('#nev').evaluate((e) => e === document.activeElement))) fail('A5', 'a fókusz nem az első hibás mezőn');
    await page.fill('#email', 'rossz-cim');
    await submit.click();
    if (!/formátuma/.test(await page.locator('#email-hiba').textContent())) fail('A5', 'hibás e-mail nincs jelezve');

    await page.fill('#nev', 'Teszt Elek');
    await page.fill('#ceg', 'Minta Kft.');
    await page.fill('#email', 'teszt@pelda.hu');
    await page.fill('#telefon', '+36 30 123 4567');
    await page.fill('#letszam', '12');
    await page.check('#hozzajarulas');
    const requests = [];
    page.on('request', (r) => requests.push(r.url()));
    const urlBefore = page.url();
    await submit.click();
    await page.waitForTimeout(500);
    const msg = await status.textContent();
    if (!/bemutató oldal/.test(msg) || !/nem továbbítottuk/.test(msg)) fail('A6', `visszajelzés: "${msg}"`);
    if (requests.length) fail('A6', `hálózati kérés: ${requests.join(', ')}`);
    if (page.url() !== urlBefore) fail('A6', 'az oldal elnavigált');
    if ((await page.inputValue('#nev')) !== '') fail('A6', 'az űrlap nem ürült ki');
    await context.close();
  }

  // ---------- A8: projektszűrő ----------
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    watch(page, 'szűrő');
    await page.goto(BASE + '/projektek', { waitUntil: 'networkidle' });
    const visibleIds = () => page.locator('.project').evaluateAll((ps) => ps.filter((p) => !p.hidden).map((p) => p.id).join(','));
    const cases = [
      ['gondozas', 'kodkert,pagony,fenytores'],
      ['zoldfal', 'rakpart'],
      ['tervezes', 'kodkert,pagony,rakpart'],
      ['osszes', 'kodkert,pagony,rakpart,fenytores'],
    ];
    if (!(await page.locator('[data-filter-group]').isVisible())) fail('A8', 'a szűrő nem látszik');
    for (const [filter, expected] of cases) {
      await page.click(`button[data-filter="${filter}"]`);
      const got = await visibleIds();
      if (got !== expected) fail('A8', `${filter}: ${got}`);
      if ((await page.getAttribute(`button[data-filter="${filter}"]`, 'aria-pressed')) !== 'true') fail('A8', `${filter}: aria-pressed`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

// ---------- Eredmény ----------
let failed = 0;
console.log('\nZöldPont Irodakert – automatikus elfogadási ellenőrzés\n');
for (const [id, msgs] of failures) {
  const ok = msgs.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? '✔' : '✘'} ${id.padEnd(3)} ${descriptions.get(id)}`);
  for (const m of [...new Set(msgs)].slice(0, 10)) console.log(`      – ${m}`);
}
console.log(`\n${failures.size - failed}/${failures.size} ellenőrzés sikeres.`);
process.exit(failed ? 1 : 0);
