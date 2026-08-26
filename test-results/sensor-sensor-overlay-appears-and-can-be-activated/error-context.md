# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sensor.spec.js >> sensor overlay appears and can be activated
- Location: tests\sensor.spec.js:58:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const http = require('http');
  3  | const path = require('path');
  4  | const fs = require('fs');
  5  | 
  6  | let server;
  7  | const port = 3001;
  8  | const baseUrl = `http://127.0.0.1:${port}`;
  9  | 
  10 | async function startServer() {
  11 |   server = http.createServer((req, res) => {
  12 |     const url = req.url === '/' ? '/index.html' : req.url;
  13 |     const filePath = path.join(__dirname, '..', url.split('?')[0]);
  14 | 
  15 |     fs.readFile(filePath, (err, data) => {
  16 |       if (err) {
  17 |         res.statusCode = 404;
  18 |         res.end('Not found');
  19 |         return;
  20 |       }
  21 | 
  22 |       const ext = path.extname(filePath);
  23 |       const contentTypes = {
  24 |         '.html': 'text/html',
  25 |         '.js': 'application/javascript',
  26 |         '.json': 'application/json',
  27 |         '.png': 'image/png',
  28 |         '.svg': 'image/svg+xml',
  29 |       };
  30 |       res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
  31 |       res.end(data);
  32 |     });
  33 |   });
  34 | 
  35 |   return new Promise((resolve, reject) => {
  36 |     server.listen(port, err => {
  37 |       if (err) reject(err);
  38 |       else resolve();
  39 |     });
  40 |   });
  41 | }
  42 | 
  43 | async function stopServer() {
  44 |   return new Promise(resolve => {
  45 |     if (!server) return resolve();
  46 |     server.close(() => resolve());
  47 |   });
  48 | }
  49 | 
  50 | test.beforeAll(async () => {
  51 |   await startServer();
  52 | });
  53 | 
  54 | test.afterAll(async () => {
  55 |   await stopServer();
  56 | });
  57 | 
  58 | test('sensor overlay appears and can be activated', async ({ page }) => {
  59 |   await page.goto(baseUrl);
  60 |   await page.waitForSelector('#sensorOverlay', { state: 'visible' });
  61 | 
  62 |   const overlay = await page.$('#sensorOverlay');
  63 |   expect(overlay).not.toBeNull();
  64 | 
  65 |   const button = await page.$('#sensorButton');
  66 |   expect(button).not.toBeNull();
  67 | 
  68 |   await button.click();
  69 |   await page.waitForTimeout(500);
  70 | 
  71 |   const hidden = await overlay.evaluate(node => node.classList.contains('hidden'));
> 72 |   expect(hidden).toBe(true);
     |                  ^ Error: expect(received).toBe(expected) // Object.is equality
  73 | 
  74 |   const leftValue = await page.$eval('.bus-icon', el => el.style.left);
  75 |   expect(leftValue).toMatch(/\d+(\.\d+)?%/);
  76 | });
  77 | 
```