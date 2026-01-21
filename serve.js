const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 5500;
const root = process.cwd();

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath.includes('..')) { res.statusCode = 400; return res.end('Bad request'); }
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(root, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err) { res.statusCode = 404; return res.end('Not found'); }
      if (stats.isDirectory()) {
        const indexFile = path.join(filePath, 'index.html');
        return fs.readFile(indexFile, (e, data) => {
          if (e) { res.statusCode = 404; return res.end('Not found'); }
          res.setHeader('Content-Type', 'text/html');
          res.end(data);
        });
      }

      fs.readFile(filePath, (e, data) => {
        if (e) { res.statusCode = 500; return res.end('Server error'); }
        const ext = path.extname(filePath).toLowerCase();
        res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
        res.end(data);
      });
    });
  } catch (err) {
    res.statusCode = 500;
    res.end('Server error');
  }
}).listen(port, () => console.log(`Static server running at http://127.0.0.1:${port}`));
