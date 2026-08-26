const { test, expect } = require('@playwright/test');
const http = require('http');
const path = require('path');
const fs = require('fs');

let server;
const port = 3001;
const baseUrl = `http://127.0.0.1:${port}`;

async function startServer() {
  server = http.createServer((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, '..', url.split('?')[0]);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath);
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
      };
      res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
      res.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function stopServer() {
  return new Promise(resolve => {
    if (!server) return resolve();
    server.close(() => resolve());
  });
}

test.beforeAll(async () => {
  await startServer();
});

test.afterAll(async () => {
  await stopServer();
});

test('sensor overlay appears and can be activated', async ({ page }) => {
  await page.goto(baseUrl);
  await page.waitForSelector('#sensorOverlay', { state: 'visible' });

  const overlay = await page.$('#sensorOverlay');
  expect(overlay).not.toBeNull();

  const button = await page.$('#sensorButton');
  expect(button).not.toBeNull();

  await button.click();
  await page.waitForTimeout(500);

  const hidden = await overlay.evaluate(node => node.classList.contains('hidden'));
  expect(hidden).toBe(true);

  const leftValue = await page.$eval('.bus-icon', el => el.style.left);
  expect(leftValue).toMatch(/\d+(\.\d+)?%/);
});
