const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Helper functions to read/write JSON
function readData() {
  return JSON.parse(fs.readFileSync('hospital.json'));
}

function writeData(data) {
  fs.writeFileSync('hospital.json', JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  // Serve static files (HTML, CSS, JS)
  if (req.url === '/' || req.url === '/index.html') {
    const html = fs.readFileSync('./public/index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(html);
  }

  if (req.url === '/style.css') {
    const css = fs.readFileSync('./public/style.css');
    res.writeHead(200, { 'Content-Type': 'text/css' });
    return res.end(css);
  }

  if (req.url === '/script.js') {
    const js = fs.readFileSync('./public/script.js');
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    return res.end(js);
  }

  // API: GET all hospitals
  if (req.url === '/hospitals' && req.method === 'GET') {
    const hospitals = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(hospitals));
  }

  // API: POST new hospital
  if (req.url === '/hospitals' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      const hospitals = readData();
      const newHospital = JSON.parse(body);
      newHospital.id = hospitals.length ? hospitals[hospitals.length - 1].id + 1 : 1;
      hospitals.push(newHospital);
      writeData(hospitals);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newHospital));
    });
    return;
  }

  // API: DELETE hospital
  if (req.url === '/hospitals' && req.method === 'DELETE') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      const { id } = JSON.parse(body);
      let hospitals = readData();
      hospitals = hospitals.filter(h => h.id !== id);
      writeData(hospitals);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Hospital deleted' }));
    });
    return;
  }

  // Fallback for unknown routes
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
