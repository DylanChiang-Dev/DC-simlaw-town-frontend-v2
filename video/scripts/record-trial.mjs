// 专门录多智能体对抗庭审：在对方律师赵雪、法官刘正的立绘上刻意停留，
// 避免快进到任务弹窗，拿到干净的“法官主持 / 对方律师应战”镜头。
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DEMO_BASE || 'http://localhost:5175';
const OUT_DIR = path.resolve(__dirname, '../public/clips/raw');
const V = { width: 1920, height: 1080 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function assistant(page) {
  const el = page.locator('.tech-ledger').locator('text=当前助手').locator('..');
  try {
    return (await page.locator('.tech-ledger').innerText()).replace(/\s+/g, ' ');
  } catch {
    return '';
  }
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: V, recordVideo: { dir: OUT_DIR, size: V } });
  const page = await context.newPage();
  const strip = () => page.locator('.demo-run-strip .primary-action');
  const marks = { opponent: null, judge: null };
  try {
    await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.case-card', { timeout: 15000 });
    await wait(900);
    await page.locator('.case-card').first().click();
    await wait(500);
    await page.locator('.case-picker-actions .primary-action').click();
    await page.waitForSelector('.mode-option-card');
    await wait(300);
    await page.locator('.mode-option-card').first().click();
    await wait(300);
    await page.locator('.case-picker .primary-action').click();
    await page.waitForSelector('.story-surface', { timeout: 15000 });
    await wait(2200);

    let done = false;
    const t0 = Date.now();
    while (Date.now() - t0 < 75000 && !done) {
      // 法官本人立绘出现（对话框出现“一审法官”标签）→ 停留后结束
      if (await page.locator('text=一审法官').count()) {
        await wait(7000);
        done = true;
        break;
      }
      // 处理任务弹窗（说明已越过法官立绘，也结束）
      if (await page.locator('.player-workbench-assist').count()) {
        const info0 = await assistant(page);
        if (info0.includes('法庭') || info0.includes('刘正')) {
          done = true;
          break;
        }
        for (const name of ['提交回复', '提交庭审发言', '提交文书并继续']) {
          const b = page.getByRole('button', { name });
          if ((await b.count()) && (await b.first().isEnabled().catch(() => false))) {
            await b.first().click();
            await wait(1400);
            break;
          }
        }
        continue;
      }
      const info = await assistant(page);
      const isOpponent = info.includes('被告律师') || info.includes('赵雪');
      if (!(await strip().isEnabled().catch(() => false))) {
        await wait(700);
        continue;
      }
      await strip().click();
      await wait(isOpponent ? 4500 : 2200);
    }
  } catch (e) {
    console.log('warn', e.message);
  }
  const video = page.video();
  await context.close();
  await browser.close();
  const target = path.join(OUT_DIR, 'v2-trial.webm');
  fs.renameSync(await video.path(), target);
  console.log('saved', target, Math.round(fs.statSync(target).size / 1024), 'KB');
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
