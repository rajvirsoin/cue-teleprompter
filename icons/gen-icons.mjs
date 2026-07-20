// Generates Cue app icons (512 / 192 / apple-touch 180) with Puppeteer.
// Run from the project root: node "Teleprompter App/icons/gen-icons.mjs"
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

const html = `<!DOCTYPE html><html><head><style>
  *{margin:0;padding:0}
  body{width:512px;height:512px;overflow:hidden}
  .tile{
    width:512px;height:512px;position:relative;
    background:
      radial-gradient(140% 90% at 50% -18%, #2a2a33, transparent 55%),
      radial-gradient(120% 80% at 50% 118%, rgba(217,124,30,.38), transparent 58%),
      #0b0b0e;
    display:flex;align-items:center;justify-content:center;
    font-family:Georgia,'Times New Roman',serif;
  }
  .c{
    font-style:italic;font-weight:600;font-size:315px;line-height:1;
    color:#f2a33c;text-shadow:0 0 90px rgba(242,163,60,.55);
    margin-top:-26px;
  }
  .ticks{position:absolute;left:0;right:0;top:352px;display:flex;justify-content:space-between;padding:0 74px}
  .ticks i{display:block;width:52px;height:13px;border-radius:8px;background:#f2a33c;box-shadow:0 0 34px rgba(242,163,60,.6)}
</style></head><body>
  <div class="tile"><div class="c">C</div><div class="ticks"><i></i><i></i></div></div>
</body></html>`;

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });

for (const [size, name] of [[512, 'icon-512.png'], [192, 'icon-192.png'], [180, 'apple-touch-icon.png']]) {
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: size / 512 });
  await page.screenshot({ path: join(here, name), clip: { x: 0, y: 0, width: 512, height: 512 } });
  console.log('wrote', name, `${size}x${size}`);
}
await browser.close();
