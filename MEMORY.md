# Repository Memory

## 主倉庫

- 主倉庫本機路徑：`/Users/dc/Documents/002/法律AI小镇/SimAilaw-town/`
- 主倉庫遠端地址：`https://github.com/chidaic/SimAilaw-town.git`
- 主倉庫前端正式位置：`/Users/dc/Documents/002/法律AI小镇/SimAilaw-town/frontend-v2/`
- 目前已確認主倉庫前端版本：`2.1.163`（2026-07-09 檢查）

## 目前這個倉庫

- 本倉庫本機路徑：`/Users/dc/Documents/002/法律AI小镇/DC-simlaw-town-frontend/`
- 本倉庫遠端地址：`https://github.com/DylanChiang-Dev/DC-simlaw-town-frontend.git`
- 本倉庫用途：獨立前端倉庫，用來同步主倉庫 `frontend-v2/` 的前端代碼。

## 同步規則

- 從主倉庫同步前端時，來源目錄使用：`/Users/dc/Documents/002/法律AI小镇/SimAilaw-town/frontend-v2/`
- 目標目錄使用：`/Users/dc/Documents/002/法律AI小镇/DC-simlaw-town-frontend/`
- 同步前端代碼時通常同步：`src/`、`public/`、`scripts/`、`tests/`、`package.json`、`package-lock.json`、`index.html`、`nginx.conf`、`tsconfig.json`、`vite.config.ts`、`VN_STYLE_RULES.md`
- 保留本倉庫特有內容，不要因同步主倉庫前端而刪除：`.git/`、`.agents/`、`.claude/`、`docs/`、`video/`、`.env.local`、`node_modules/`、`dist/`

## 2026-07-09 V5 宣傳片配音與導出

- V5 宣傳片已接入火山豆包 TTS 2.0 配音與 BGM，預覽工程仍在 `video/` Remotion 專案中。
- 火山 TTS 使用 `seed-tts-2.0`，音色使用 `zh_female_xiaohe_uranus_bigtts`；敏感 token 只允許運行時注入，不寫入倉庫、記憶或提交。
- V5 配音節奏規則：每段 MP3 實際時長 + 900ms，總片長維持 60 秒；最後旁白與字幕移除「開始體驗」。
- 已導出成片：`video/out/legalworld-promo-v5-voiceover.mp4`。
- 後續涉及 BGM、TTS、渲染或外部服務時，必須先確認；不要擅自生成成片。

## 2026-07-09 V4 宣傳片配音完成

- V4 已按 MCP 強化版定位完成火山豆包 TTS 2.0 配音，七段旁白分别存放在 `video/public/voiceover/v4/`。
- 每段场景按「MP3 实际时长 + 900ms」重新排布，总时长约 80 秒；字幕、配音稿和 Remotion 时间轴已同步。
- V4、V5 共用 `Signal to Noise` BGM，来源与 CC BY 4.0 署名保存在 `video/public/audio/ATTRIBUTION.md`。
- TTS 凭据只从运行时环境变量读取，仓库只保留生成脚本和最终音频，不保存 token。
