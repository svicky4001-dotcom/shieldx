const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const db = require('./db.js');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- REST API ENDPOINTS ---

  // Search Suggestions
  if (pathname === '/api/companies/search' && req.method === 'GET') {
    const query = parsedUrl.query.q || '';
    const results = db.searchCompanyNames(query);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
    return;
  }

  // Company Full View with AI Vision Confidence & Threat Breakdown
  if (pathname.startsWith('/api/company/') && req.method === 'GET') {
    const companyName = decodeURIComponent(pathname.replace('/api/company/', ''));
    const fullView = db.getCompanyFullView(companyName);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(fullView));
    return;
  }

  // AI Dark Web Leaks API
  if (pathname === '/api/darkweb/leaks' && req.method === 'GET') {
    const companyName = parsedUrl.query.company || '';
    const leaks = db.getDarkWebLeaks(companyName);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(leaks));
    return;
  }

  // AI Legal Notice Generator API
  if (pathname === '/api/ai/legal-notice' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const notice = db.generateAILegalNotice(
        data.threatId,
        data.companyName,
        data.threatName,
        data.platform
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, notice }));
    });
    return;
  }

  // AI VIP Executive Protection API
  if (pathname === '/api/vip/profiles' && req.method === 'GET') {
    const companyName = parsedUrl.query.company || '';
    const vips = db.getVipProfiles(companyName);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(vips));
    return;
  }

  // Warning Notice API
  if (pathname === '/api/warning' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const warningRecord = db.sendWarningNotice(
        data.threatId,
        data.companyName,
        data.threatName,
        data.platform
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, warning: warningRecord }));
    });
    return;
  }

  // Bulk Warning Notices API
  if (pathname === '/api/warnings/bulk' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const results = db.sendBulkWarningNotices(data.threats || []);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, warnings: results }));
    });
    return;
  }

  // Takedown Request API
  if (pathname === '/api/takedown' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const takedownRecord = db.fileTakedown(
        data.threatId,
        data.companyName,
        data.threatName,
        data.platform
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, takedown: takedownRecord }));
    });
    return;
  }

  // Save Official Profile
  if (pathname === '/api/company/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const updatedProfile = db.saveCompanyProfile(
        data.companyName,
        data.domain,
        data.officialChannels
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, profile: updatedProfile }));
    });
    return;
  }

  // Stats Telemetry
  if (pathname === '/api/db/stats' && req.method === 'GET') {
    const stats = db.getStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }

  // Audit Logs
  if (pathname === '/api/audit-logs' && req.method === 'GET') {
    const logs = db.getAuditLogs();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(logs));
    return;
  }

  // Static File Server
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🤖 ShieldWatch AI DRP Server running on http://localhost:${PORT}`);
});
