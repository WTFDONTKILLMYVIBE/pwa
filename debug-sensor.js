const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const port = 3001;
const baseUrl = `http://127.0.0.1:${port}`;
let server;

async function startServer() {
  server = http.createServer((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, url.split('?')[0]);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        return res.end('Not found');
      }
      const contentTypes = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png' };
      res.setHeader('Content-Type', contentTypes[path.extname(filePath)] || 'application/octet-stream');
      res.end(data);
    });
  });
  return new Promise((resolve, reject) => server.listen(port, err => err ? reject(err) : resolve()));
}

async function stopServer() {
  return new Promise(resolve => server.close(resolve));
}

(async () => {
  await startServer();
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG>', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR>', err));
  await page.goto(baseUrl);
  console.log('overlay visible:', await page.isVisible('#sensorOverlay'));
  await page.click('#sensorButton');
  await page.waitForTimeout(500);
  console.log('overlay hidden class:', await page.$eval('#sensorOverlay', el => el.className));
  console.log('button disabled:', await page.$eval('#sensorButton', el => el.disabled));
  console.log('bus left:', await page.$eval('.bus-icon', el => el.style.left));
  await browser.close();
  await stopServer();
})();
