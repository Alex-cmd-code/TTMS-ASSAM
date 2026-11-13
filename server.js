const http = require('http');
const fs = require('fs');
const path = require('path');

// Auto-load environment variables from .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    });
  } catch (e) {
    console.warn('Could not read .env file:', e);
  }
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  // Normalize URL
  let parsedUrl = req.url.split('?')[0];

  // API Config Endpoint to expose public Supabase configuration safely
  if (parsedUrl === '/api/config') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      supabaseUrl: process.env.SUPABASE_URL || 'https://bvewsblubmivxbtaybaq.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZXdzYmx1Ym1pdnhidGF5YmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MzM4MjcsImV4cCI6MjExMDEwOTgyN30.9A85UHN0_GVMuodTF1NOILoM1RrO95vz___ppma1dM4',
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_gOHK06m4HiJrDIAHxtKajw_YpPEjhnR',
      projectName: process.env.SUPABASE_PROJECT_NAME || 'HRMS',
      projectRef: process.env.SUPABASE_PROJECT_ID || 'bvewsblubmivxbtaybaq',
      storageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'assam-live-assets'
    }));
    return;
  }

  if (parsedUrl === '/' || parsedUrl === '') {
    parsedUrl = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, decodeURIComponent(parsedUrl));

  // Security check: ensure path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  // Prevent serving .env directly to clients for security
  const baseName = path.basename(filePath);
  if (baseName === '.env' || baseName.startsWith('.env.')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA if not an asset
      const ext = path.extname(filePath);
      if (!ext || ext === '.html') {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, (indexErr, content) => {
          if (indexErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
          }
        });
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

// Only start listening if run directly from CLI (e.g. node server.js)
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`TTMS Assam Portal running at http://localhost:${PORT}`);
  });
}

// Export handler for serverless environments (e.g. Vercel)
module.exports = (req, res) => {
  server.emit('request', req, res);
};
module.exports.server = server;
