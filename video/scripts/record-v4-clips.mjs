import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DEMO_BASE || 'http://localhost:5174';
const OUT_DIR = path.resolve(__dirname, '../public/clips/raw');
const VIEWPORT = { width: 1920, height: 1080 };

fs.mkdirSync(OUT_DIR, { recursive: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function record(name, fn) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();
  try {
    await fn(page);
  } catch (error) {
    console.log(`  [${name}] warn: ${error.message}`);
  }
  const video = page.video();
  await context.close();
  await browser.close();
  const target = path.join(OUT_DIR, `${name}.webm`);
  fs.renameSync(await video.path(), target);
  console.log(`  [${name}] ${Math.round(fs.statSync(target).size / 1024)} KB`);
}

async function recordModes() {
  await record('v4-modes', async (page) => {
    await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.case-card', { timeout: 15000 });
    await wait(900);
    await page.locator('.case-card').first().click();
    await wait(600);
    await page.locator('.case-picker-actions .primary-action').click();
    await page.waitForSelector('.mode-option-card', { timeout: 10000 });
    await wait(900);
    const cards = page.locator('.mode-option-card');
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 2); i += 1) {
      await cards.nth(i).hover().catch(() => {});
      await wait(1300);
    }
    await cards.first().click().catch(() => {});
    await wait(1400);
  });
}

async function recordMcpLanding() {
  await record('v4-mcp-landing', async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.landing-mcp-cta', { timeout: 15000 });
    await wait(1200);
    await page.locator('.landing-mcp-cta').hover();
    await wait(1800);
    await page.locator('.landing-mcp-cta').click();
    await page.waitForSelector('.mcp-hero-title', { timeout: 10000 });
    await wait(1700);
  });
}

async function recordMcpPage() {
  await record('v4-mcp-page', async (page) => {
    await page.goto(`${BASE}/mcp`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.mcp-highlight-card', { timeout: 15000 });
    await wait(1200);
    await page.mouse.wheel(0, 680);
    await wait(1600);
    await page.mouse.wheel(0, 1040);
    await wait(1600);
    await page.mouse.wheel(0, 1120);
    await wait(2000);
  });
}

async function main() {
  console.log(`Recording v4 clips from ${BASE} ...`);
  await recordModes();
  await recordMcpLanding();
  await recordMcpPage();
  console.log('v4 clips recorded.');
}

main().catch((error) => {
  console.error('FATAL', error);
  process.exit(1);
});
