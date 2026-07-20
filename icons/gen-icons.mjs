// Generates Cue app icons (512 / 192 / apple-touch 180) with Puppeteer.
// NIOS Media brand: ink #141414, butter #F3D37C, Bicubik display face.
// Run from the project root: node "Teleprompter App/icons/gen-icons.mjs"
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const bicubik = readFileSync(join(here, '..', 'fonts', 'Bicubik.otf')).toString('base64');

const html = `<!DOCTYPE html><html><head><style>
  @font-face{font-family:'Bicubik';src:url(data:font/otf;base64,${bicubik}) format('opentype')}
  *{margin:0;padding:0}
  body{width:512px;height:512px;overflow:hidden}
  .tile{
    width:512px;height:512px;position:relative;
    background:
      radial-gradient(130% 85% at 50% -15%, #262626, transparent 55%),
      radial-gradient(120% 80% at 50% 118%, rgba(201,158,58,.30), transparent 58%),
      #141414;
    display:flex;align-items:center;justify-content:center;
    font-family:'Bicubik',sans-serif;
  }
  .c{
    font-size:268px;line-height:1;
    color:#F3D37C;text-shadow:0 0 90px rgba(243,211,124,.5);
    margin-top:-30px;
  }
  .ticks{position:absolute;left:0;right:0;top:356px;display:flex;justify-content:space-between;padding:0 72px}
  .ticks i{display:block;width:54px;height:13px;border-radius:8px;background:#F3D37C;box-shadow:0 0 34px rgba(243,211,124,.55)}
  .by{position:absolute;left:0;right:0;top:412px;text-align:center;font-family:'Bicubik',sans-serif;
      font-size:25px;letter-spacing:.3em;color:rgba(243,241,236,.88);padding-left:.3em}
</style></head><body>
  <div class="tile"><div class="c">C</div><div class="ticks"><i></i><i></i></div><div class="by">NIOS</div></div>
</body></html>`;

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluateHandle('document.fonts.ready');

for (const [size, name] of [[512, 'icon-512.png'], [192, 'icon-192.png'], [180, 'apple-touch-icon.png']]) {
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: size / 512 });
  await page.screenshot({ path: join(here, name), clip: { x: 0, y: 0, width: 512, height: 512 } });
  console.log('wrote', name, `${size}x${size}`);
}
await browser.close();
