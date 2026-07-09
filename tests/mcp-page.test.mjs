import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const mcpPagePath = join(root, 'src', 'components', 'mcp', 'PublicMcpPage.tsx');
assert.equal(existsSync(mcpPagePath), true, 'PublicMcpPage should exist at components/mcp.');

// --- routing in main.tsx ---
const mainSource = read('src/main.tsx');
assert.match(
  mainSource,
  /cleanPathname\.endsWith\('\/mcp'\)\s*\?\s*PublicMcpPage/,
  'main.tsx should route /mcp to PublicMcpPage.',
);
assert.match(
  mainSource,
  /import \{ PublicMcpPage \} from '\.\/components\/mcp\/PublicMcpPage';/,
  'main.tsx should import PublicMcpPage.',
);
assert.match(
  mainSource,
  /document\.body\.classList\.toggle\('mcp-route', cleanPathname\.endsWith\('\/mcp'\)\)/,
  'main.tsx should add a body class for the mcp route.',
);

const stylesSource = read('src/styles.css');
assert.match(
  stylesSource,
  /body\.mcp-route\s*\{[^}]*overflow-y:\s*auto/,
  'The standalone /mcp page should allow vertical document scrolling.',
);

// --- landing hero links within the deployed base path instead of opening a modal ---
const heroSource = read('src/components/landing/LandingHero.tsx');
assert.match(
  heroSource,
  /const MCP_PAGE_HREF = `\$\{import\.meta\.env\.BASE_URL\}mcp`;/,
  'LandingHero should build the MCP link from Vite BASE_URL so production uses /legalworld/mcp.',
);
assert.match(
  heroSource,
  /<a className="landing-mcp-cta" href=\{MCP_PAGE_HREF\}>/,
  'LandingHero MCP CTA should navigate to the base-scoped MCP page.',
);
assert.doesNotMatch(
  heroSource,
  /onOpenMcp/,
  'LandingHero should no longer take an onOpenMcp modal callback.',
);

// --- the page renders the structured MCP content ---
const pageSource = read('src/components/mcp/PublicMcpPage.tsx');
for (const symbol of ['MCP_HIGHLIGHTS', 'MCP_STAGES', 'MCP_SKILLS', 'MCP_TOOLS', 'MCP_TRAINING_SIGNALS']) {
  assert.match(pageSource, new RegExp(`${symbol}\\.map`), `PublicMcpPage should render ${symbol} rows.`);
}
assert.match(
  pageSource,
  /const LANDING_PAGE_HREF = import\.meta\.env\.BASE_URL;/,
  'PublicMcpPage should build the back link from Vite BASE_URL.',
);
assert.match(
  pageSource,
  /window\.location\.assign\(LANDING_PAGE_HREF\)/,
  'PublicMcpPage should provide a base-scoped back link to the landing page.',
);

// --- content constants exist with the expected cardinality ---
const projectInfoSource = read('src/config/projectInfo.ts');
assert.equal(
  (projectInfoSource.match(/category:\s*'(?:核心|扩展|调试)',\s*desc:/g) || []).length,
  17,
  'MCP_TOOLS should enumerate 17 tool capabilities.',
);
assert.equal(
  (projectInfoSource.match(/type:\s*'(?:律师文书|记忆沉淀)',\s*desc:/g) || []).length,
  6,
  'MCP_SKILLS should enumerate 6 skills.',
);
for (const stage of ['PLC', 'CD', 'DLC', 'DD', 'CI', 'AD', 'AR', 'CIA']) {
  assert.match(projectInfoSource, new RegExp(`code:\\s*'${stage}'`), `MCP_STAGES should include the ${stage} stage.`);
}
assert.doesNotMatch(
  projectInfoSource,
  /LANDING_MCP_TITLE|LANDING_MCP_INTRO|LANDING_MCP_CAPABILITIES/,
  'The retired MCP modal constants should be removed from projectInfo.',
);

// --- package.json exposes the focused test ---
assert.match(
  read('package.json'),
  /"test:mcp-page":\s*"node tests\/mcp-page\.test\.mjs"/,
  'frontend-v2 should expose a focused mcp page test script.',
);

console.log('mcp-page.test.mjs: OK');
