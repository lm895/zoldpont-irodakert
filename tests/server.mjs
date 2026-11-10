// Kis helyi kiszolgáló, amely a Cloudflare Pages viselkedését utánozza:
//  - "/kapcsolat" → kapcsolat.html, "/" → index.html
//  - "/kapcsolat.html" → 308-as átirányítás "/kapcsolat"-ra
//  - nem létező útvonal → 404.html, 404-es státusszal
//  - a site/_headers fájl fejléceit alkalmazza (így a CSP-hibák helyben is kiderülnek)
// Használat: node tests/server.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../site');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function parseHeadersFile() {
  const file = path.join(SITE_DIR, '_headers');
  if (!fs.existsSync(file)) return [];
  const rules = [];
  let current = null;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      current = { pattern: raw.trim(), headers: {} };
      rules.push(current);
    } else if (current) {
      const i = raw.indexOf(':');
      current.headers[raw.slice(0, i).trim()] = raw.slice(i + 1).trim();
    }
  }
  return rules;
}

function matches(pattern, urlPath) {
  if (pattern.endsWith('*')) return urlPath.startsWith(pattern.slice(0, -1));
  return pattern === urlPath;
}

function resolveFile(urlPath) {
  const safe = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [];
  if (safe.endsWith('/')) candidates.push(path.join(safe, 'index.html'));
  else candidates.push(safe, safe + '.html', path.join(safe, 'index.html'));
  for (const c of candidates) {
    const full = path.join(SITE_DIR, c);
    if (full.startsWith(SITE_DIR) && fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  return null;
}

export function startServer(port = 0) {
  const rules = parseHeadersFile();
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const urlPath = url.pathname;

    for (const rule of rules) {
      if (matches(rule.pattern, urlPath)) {
        for (const [k, v] of Object.entries(rule.headers)) res.setHeader(k, v);
      }
    }

    if (urlPath.endsWith('.html')) {
      const pretty = urlPath === '/index.html' ? '/' : urlPath.slice(0, -5);
      res.writeHead(308, { Location: pretty + url.search });
      return res.end();
    }
    if (path.basename(urlPath).startsWith('_')) {
      return send404(res);
    }

    const file = resolveFile(urlPath);
    if (!file) return send404(res);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });

  function send404(res) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(fs.readFileSync(path.join(SITE_DIR, '404.html')));
  }

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] || 8080);
  startServer(port).then(() => console.log(`ZöldPont helyi kiszolgáló: http://localhost:${port}`));
}
