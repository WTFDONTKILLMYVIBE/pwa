const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8000/');

  const result = await page.evaluate(() => {
    const bus = document.querySelector('.bus-icon');
    const body = document.body;
    const rect = bus ? bus.getBoundingClientRect() : null;
    const comp = bus ? getComputedStyle(bus).backgroundImage : null;
    const bodyBg = getComputedStyle(body).backgroundImage;
    return {
      url: location.href,
      busExists: !!bus,
      busRect: rect,
      busBackground: comp,
      bodyBackground: bodyBg,
      firstPixel: (() => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
        const ctx = canvas.getContext('2d');
        const bodyStyle = getComputedStyle(body);
        ctx.drawImage(document.querySelector('img') || new Image(), 0, 0);
        return { width: rect.width, height: rect.height };
      })(),
    };
  });

  console.log('Bus detection result:', result);

  if (!result.busExists) {
    console.error('Bus element not found.');
    await browser.close();
    process.exit(1);
  }

  if (!result.busBackground || result.busBackground.includes('data:image/jpeg')) {
    console.error('bus-icon still uses a data URI background.');
  } else {
    console.log('bus-icon background OK');
  }

  await browser.close();
})();