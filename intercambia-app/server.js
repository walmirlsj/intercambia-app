/**
 * Servidor local para testar o IntercambIA antes do deploy no Vercel.
 * Não precisa instalar nada além do Node.js.
 *
 * Como usar:
 *   1. Coloque sua API key no arquivo .env  (ANTHROPIC_API_KEY=sk-ant-...)
 *   2. No terminal, dentro desta pasta, rode:  node server.js
 *   3. Abra o browser em:  http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Carrega o .env manualmente (sem dependências externas)
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

loadEnv();

const PORT = 3000;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const server = http.createServer(async (req, res) => {

  // ── Rota da API ──────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/api/chat') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY não encontrada no .env' }));
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      };

      const apiReq = https.request(options, apiRes => {
        res.writeHead(apiRes.statusCode, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        });
        apiRes.on('data', chunk => res.write(chunk));
        apiRes.on('end', () => res.end());
      });

      apiReq.on('error', err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });

      apiReq.write(body);
      apiReq.end();
    });
    return;
  }

  // ── Arquivos estáticos ───────────────────────────────────────────
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  if (!fs.existsSync(filePath)) {
    // fallback para index.html (SPA)
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Não encontrado');
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ✦ IntercambIA rodando localmente!');
  console.log('');
  console.log('  Abra no browser:  http://localhost:' + PORT);
  console.log('');
  console.log('  Para parar o servidor: pressione Ctrl+C');
  console.log('');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('  ⚠️  ATENÇÃO: API key não encontrada!');
    console.log('  Crie um arquivo .env nesta pasta com o conteúdo:');
    console.log('  ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui');
    console.log('');
  }
});
