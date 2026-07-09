# Repository Memory

## 主倉庫

- 主倉庫本機路徑：`/Users/dc/Documents/SimAilaw-town/`
- 主倉庫遠端地址：`https://github.com/chidaic/SimAilaw-town.git`
- 主倉庫前端正式位置：`/Users/dc/Documents/SimAilaw-town/frontend-v2/`
- 目前已確認主倉庫前端版本：`2.1.163`（2026-07-09 檢查）

## 目前這個倉庫

- 本倉庫本機路徑：`/Users/dc/Documents/DylanChiang-Dev/DC-simlaw-town-frontend/`
- 本倉庫遠端地址：`https://github.com/DylanChiang-Dev/DC-simlaw-town-frontend.git`
- 本倉庫用途：獨立前端倉庫，用來同步主倉庫 `frontend-v2/` 的前端代碼。

## 同步規則

- 從主倉庫同步前端時，來源目錄使用：`/Users/dc/Documents/SimAilaw-town/frontend-v2/`
- 目標目錄使用：`/Users/dc/Documents/DylanChiang-Dev/DC-simlaw-town-frontend/`
- 同步前端代碼時通常同步：`src/`、`public/`、`scripts/`、`tests/`、`package.json`、`package-lock.json`、`index.html`、`nginx.conf`、`tsconfig.json`、`vite.config.ts`、`VN_STYLE_RULES.md`
- 保留本倉庫特有內容，不要因同步主倉庫前端而刪除：`.git/`、`.agents/`、`.claude/`、`docs/`、`video/`、`.env.local`、`node_modules/`、`dist/`
