// v2 录屏：修正 v1 特写糊/框不准的问题 + 新增多智能体庭审。
// 面板为固定宽度（tech-ledger 250px / town-radar 340px），故对特写用 CSS zoom 放大后录制，
// 再用 Playwright 抓 boundingBox 交给 ffmpeg 精准裁切（见 crop-clips-v2.mjs）。
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DEMO_BASE || 'http://localhost:5175';
const OUT_DIR = path.resolve(__dirname, '../public/clips/raw');
const META = path.resolve(__dirname, '../public/clips/crops.json');
const V = { width: 1920, height: 1080 };

fs.mkdirSync(OUT_DIR, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const crops = {};

async function record(name, zoom, fn) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: V,
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: V },
  });
  const page = await context.newPage();
  try {
    await fn(page);
  } catch (e) {
    console.log(`  [${name}] warn:`, e.message);
  }
  const video = page.video();
  await context.close();
  await browser.close();
  const target = path.join(OUT_DIR, `${name}.webm`);
  fs.renameSync(await video.path(), target);
  console.log(`  [${name}] ${Math.round(fs.statSync(target).size / 1024)} KB`);
}

async function enter(page) {
  await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.case-card', { timeout: 15000 });
  await wait(1000);
  await page.locator('.case-card').first().click();
  await wait(600);
  await page.locator('.case-picker-actions .primary-action').click();
  await page.waitForSelector('.mode-option-card', { timeout: 8000 });
  await wait(400);
  await page.locator('.mode-option-card').first().click();
  await wait(300);
  await page.locator('.case-picker .primary-action').click();
  await page.waitForSelector('.story-surface', { timeout: 15000 });
  await wait(2200);
}

const strip = (page) => page.locator('.demo-run-strip .primary-action');

async function submitOpenTask(page) {
  if (!(await page.locator('.player-workbench-assist').count())) return false;
  for (const name of ['提交回复', '提交庭审发言', '提交文书并继续']) {
    const b = page.getByRole('button', { name });
    if ((await b.count()) && (await b.first().isEnabled().catch(() => false))) {
      await b.first().click();
      await wait(1400);
      return true;
    }
  }
  return false;
}

async function main() {
  console.log(`Recording v2 from ${BASE} ...`);

  // 1) 案件选择器浏览
  await record('v2-casepicker', 1, async (page) => {
    await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.case-card', { timeout: 15000 });
    await wait(1400);
    const cards = page.locator('.case-card');
    const n = Math.min(await cards.count(), 5);
    for (let i = 0; i < n; i += 1) {
      await cards.nth(i).hover().catch(() => {});
      await wait(850);
    }
    await wait(1000);
  });

  // 2) VN 舞台（全屏，用于卖点①的六阶段/舞台）
  await record('v2-stage', 1, async (page) => {
    await enter(page);
    for (let i = 0; i < 5; i += 1) {
      if (await page.locator('.player-workbench-assist').count()) break;
      if (!(await strip(page).isEnabled().catch(() => false))) break;
      await strip(page).click();
      await wait(2200);
    }
    await wait(1200);
  });

  // 3) 工具/技能面板特写（zoom 放大后录，之后裁切）
  await record('v2-panel', 1, async (page) => {
    await enter(page);
    await strip(page).click().catch(() => {});
    await wait(1600);
    await page.evaluate(() => (document.body.style.zoom = '1.95'));
    await wait(1200);
    const bb = await page.locator('.tech-ledger').boundingBox();
    crops.panel = bb;
    // 再推进一次让工具状态变化，制造动感
    await strip(page).click().catch(() => {});
    await wait(4200);
  });

  // 4) 小镇雷达特写
  await record('v2-radar', 1, async (page) => {
    await enter(page);
    await page.evaluate(() => (document.body.style.zoom = '1.6'));
    await wait(800);
    await page.locator('.town-radar').scrollIntoViewIfNeeded().catch(() => {});
    await wait(800);
    const bb = await page.locator('.town-radar').boundingBox();
    crops.radar = bb;
    await wait(4200);
  });

  // 5) 多智能体对抗庭审：提交 PLC 任务后推进至法官刘正 / 对方律师赵雪
  await record('v2-trial', 1, async (page) => {
    await enter(page);
    const t0 = Date.now();
    while (Date.now() - t0 < 40000) {
      if (await page.locator('.player-workbench-assist').count()) {
        const submitted = await submitOpenTask(page);
        if (!submitted) {
          // 庭审任务弹窗：停留展示后提交继续
          await wait(2600);
          await submitOpenTask(page);
        }
        continue;
      }
      if (!(await strip(page).isEnabled().catch(() => false))) {
        await wait(1000);
        continue;
      }
      await strip(page).click();
      await wait(2100);
    }
  });

  // 6) 起草文书/陈述任务弹窗（卖点①的“你亲自起草”）
  await record('v2-court', 1, async (page) => {
    await enter(page);
    const t0 = Date.now();
    while (Date.now() - t0 < 22000) {
      if (await page.locator('.player-workbench-assist').count()) {
        await wait(6000);
        break;
      }
      if (!(await strip(page).isEnabled().catch(() => false))) {
        await wait(800);
        continue;
      }
      await strip(page).click();
      await wait(1500);
    }
    await wait(2000);
  });

  fs.writeFileSync(META, JSON.stringify(crops, null, 2));
  console.log('crops.json =', JSON.stringify(crops));
  console.log('v2 recording done.');
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
