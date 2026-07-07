// 用 Playwright 驱动 /demo，录制无声演示片段（1920x1080 webm）。
// 前提：主前端 dev server 在 BASE 运行（默认 http://localhost:5175）。
// 输出：video/public/clips/raw/*.webm，随后由 convert-clips 转 mp4。
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DEMO_BASE || 'http://localhost:5175';
const OUT_DIR = path.resolve(__dirname, '../public/clips/raw');
const VIEWPORT = { width: 1920, height: 1080 };

fs.mkdirSync(OUT_DIR, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRecording(name, fn) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();
  let error = null;
  try {
    await fn(page);
  } catch (e) {
    error = e;
    console.log(`  [${name}] warn:`, e.message);
  }
  const video = page.video();
  await context.close();
  await browser.close();
  const raw = await video.path();
  const target = path.join(OUT_DIR, `${name}.webm`);
  fs.renameSync(raw, target);
  const kb = Math.round(fs.statSync(target).size / 1024);
  console.log(`  [${name}] saved ${target} (${kb} KB)${error ? ' (with warnings)' : ''}`);
}

// 进入选案 -> 选第一个案件 -> 进入所选案件 -> 选模式 -> 确认开始 -> 等待仿真舞台
async function enterSimulation(page) {
  await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.case-card', { timeout: 15000 });
  await wait(1200);
  await page.locator('.case-card').first().click();
  await wait(700);
  await page.locator('.case-picker-actions .primary-action').click(); // 进入所选案件
  await page.waitForSelector('.mode-option-card', { timeout: 8000 });
  await wait(500);
  await page.locator('.mode-option-card').first().click();
  await wait(400);
  await page.locator('.case-picker .primary-action').click(); // 确认开始
  await page.waitForSelector('.story-surface', { timeout: 15000 });
  await wait(2200); // 让首句对白渲染
}

// 推进对白：点 demo-run-strip 的推进按钮，直到禁用或出现庭审弹窗
async function advance(page, times, gapMs) {
  const btn = page.locator('.demo-run-strip .primary-action');
  for (let i = 0; i < times; i += 1) {
    if (await page.locator('.player-workbench-assist').count()) return 'dialog';
    const enabled = (await btn.count()) && (await btn.isEnabled().catch(() => false));
    if (!enabled) return 'stuck';
    await btn.click().catch(() => {});
    await wait(gapMs);
  }
  return 'done';
}

async function main() {
  console.log(`Recording /demo clips from ${BASE} ...`);

  // Clip 1: 案件选择器（Case Docket）浏览 ~7s
  await withRecording('clip-casepicker', async (page) => {
    await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.case-card', { timeout: 15000 });
    await wait(1500);
    const cards = page.locator('.case-card');
    const n = Math.min(await cards.count(), 5);
    for (let i = 0; i < n; i += 1) {
      await cards.nth(i).hover().catch(() => {});
      await wait(900);
    }
    await wait(1200);
  });

  // Clip 2: 进入仿真 + VN 舞台对白推进 ~20s
  await withRecording('clip-stage', async (page) => {
    await enterSimulation(page);
    await advance(page, 8, 2400);
    await wait(1500);
  });

  // Clip 3: 推进至庭审发言任务弹窗，展示起草 + AI 润色 ~14s
  await withRecording('clip-court', async (page) => {
    await enterSimulation(page);
    const result = await advance(page, 14, 1600);
    if (result === 'dialog' || (await page.locator('.player-workbench-assist').count())) {
      await wait(2500);
      const polish = page.getByRole('button', { name: 'AI 润色' });
      if (await polish.count()) {
        await polish.first().click().catch(() => {});
        await wait(2500);
      }
      await wait(2500);
    } else {
      console.log('  [clip-court] 未到达庭审任务弹窗，result=', result);
      await wait(1500);
    }
  });

  console.log('All clips recorded.');
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
