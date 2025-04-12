const http = require('http');
const fs = require('fs');
const path = require('path');
const filePath= path.join(__dirname, 'hospital.json');

function readData() {
  const data = fs.readFileSync(hospital.json);
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(hospital.json, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    if (url === '/hospitals') {
      let hospitals = readData();

      if (method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(hospitals));

      } else if (method === 'POST') {
        const newHospital = JSON.parse(body);
        newHospital.id = hospitals.length ? hospitals[hospitals.length - 1].id + 1 : 1;
        hospitals.push(newHospital);
        writeData(hospitals);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newHospital));

      } else if (method === 'PUT') {
        const updatedHospital = JSON.parse(body);
        const index = hospitals.findIndex(h => h.id === updatedHospital.id);
        if (index !== -1) {
          hospitals[index] = updatedHospital;
          writeData(hospitals);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedHospital));
        } else {
          res.writeHead(404);
          res.end('Hospital not found');
        }

      } else if (method === 'DELETE') {
        const { id } = JSON.parse(body);
        const index = hospitals.findIndex(h => h.id === id);
        if (index !== -1) {
          hospitals.splice(index, 1);
          writeData(hospitals);
          res.writeHead(200);
          res.end('Hospital deleted');
        } else {
          res.writeHead(404);
          res.end('Hospital not found');
        }

      } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
      }
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
