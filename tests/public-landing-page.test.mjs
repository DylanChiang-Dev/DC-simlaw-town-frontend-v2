import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const landingPagePath = join(root, 'src', 'components', 'PublicLandingPage.tsx');
const landingDir = join(root, 'src', 'components', 'landing');
const projectInfoSource = readFileSync(join(root, 'src', 'config', 'projectInfo.ts'), 'utf8');
const packageSource = readFileSync(join(root, 'package.json'), 'utf8');
const indexHtmlSource = readFileSync(join(root, 'index.html'), 'utf8');
const stylesSource = readFileSync(join(root, 'src', 'styles.css'), 'utf8');
const landingNavSource = readFileSync(join(landingDir, 'LandingNav.tsx'), 'utf8');

assert.ok(existsSync(landingPagePath), 'PublicLandingPage.tsx should exist.');

const landingDirFiles = readdirSync(landingDir).filter(
  (file) => file.endsWith('.tsx') || file.endsWith('.ts'),
);
assert.ok(landingDirFiles.length > 0, 'src/components/landing should contain landing subcomponents.');

const landingSource = [
  readFileSync(landingPagePath, 'utf8'),
  ...landingDirFiles.map((file) => readFileSync(join(landingDir, file), 'utf8')),
].join('\n');

assert.match(
  packageSource,
  /"test:public-landing":\s*"node tests\/public-landing-page\.test\.mjs"/,
  'package.json should expose a focused public landing page test script.',
);

// ---- projectInfo copy: hero + capabilities ----
assert.match(
  projectInfoSource,
  /LANDING_HERO_TITLE\s*=\s*'Legal World'/,
  'projectInfo should define Legal World as a standalone hero title.',
);
assert.match(
  projectInfoSource,
  /LANDING_HERO_SUBTITLE\s*=\s*'大规模、高保真的交互式法律世界'/,
  'projectInfo should define the hero subtitle.',
);
assert.doesNotMatch(
  projectInfoSource,
  /LANDING_HERO_SLOGAN/,
  'The retired hero slogan constant should be removed from projectInfo.',
);
assert.match(
  projectInfoSource,
  /LANDING_PRIMARY_CTA\s*=\s*'在线体验'/,
  'projectInfo should define the primary CTA label.',
);
assert.match(
  projectInfoSource,
  /LANDING_SECONDARY_CTA\s*=\s*'查看项目介绍'/,
  'projectInfo should define the secondary CTA label.',
);
assert.match(
  projectInfoSource,
  /LANDING_PROJECT_URL\s*=\s*'https:\/\/chidaic\.github\.io\/Legal-world'/,
  'projectInfo should define the external project intro URL.',
);
assert.match(
  projectInfoSource,
  /LANDING_CAPABILITIES[\s\S]*案件推演[\s\S]*动态模拟案件发展、策略选择与结果演化。[\s\S]*人机对打[\s\S]*与 AI 法律智能体实时交锋，在对抗中检验推理、辩论与决策能力。[\s\S]*智能体训练[\s\S]*在复杂动态法律场景中，训练你的专属法律智能体。/,
  'projectInfo should define the three capability blocks with approved copy.',
);
assert.match(
  projectInfoSource,
  /LANDING_CAPABILITIES_TITLE\s*=\s*'What can Legal World do\?'/,
  'projectInfo should define the capabilities section title.',
);

// ---- projectInfo copy: expanded landing sections ----
assert.match(
  projectInfoSource,
  /LANDING_HERO_EYEBROW\s*=\s*'案件推演｜全流程诉讼仿真｜模拟法庭｜法学研究｜智能体训练'/,
  'projectInfo should define the hero eyebrow badge copy.',
);
assert.match(
  projectInfoSource,
  /LANDING_INSTITUTION_BRAND\s*=\s*'上海创智学院 × 复旦大学数据智能与社会计算实验室'/,
  'projectInfo should define the full joint institution brand copy.',
);
assert.match(
  projectInfoSource,
  /LANDING_FLOW_STEPS[\s\S]*咨询受理[\s\S]*起诉与答辩[\s\S]*庭审调查[\s\S]*法庭辩论[\s\S]*判决[\s\S]*上诉/,
  'projectInfo should define six litigation lifecycle steps.',
);
assert.match(
  projectInfoSource,
  /LANDING_SHOWCASE_ITEMS[\s\S]*文书工作台[\s\S]*多智能体庭审引擎/,
  'projectInfo should define the product showcase items.',
);
assert.match(
  projectInfoSource,
  /LANDING_INSTITUTIONS[\s\S]*上海创智学院[\s\S]*复旦大学 DISC 实验室/,
  'projectInfo should define the institution names used by the nav and footer.',
);
assert.doesNotMatch(
  projectInfoSource,
  /DISA/,
  'The Fudan lab abbreviation should be DISC (Data Intelligence and Social Computing), not DISA.',
);
assert.match(
  projectInfoSource,
  /LANDING_FOOTER_COPYRIGHT\s*=\s*'© 2026 上海创智学院 · 复旦大学数据智能与社会计算实验室'/,
  'projectInfo should define the footer copyright line.',
);

// ---- PublicLandingPage composition shell ----
assert.match(
  landingSource,
  /type Props = \{[\s\S]*onStartExperience:\s*\(\)\s*=>\s*void;[\s\S]*\}/,
  'PublicLandingPage should accept an onStartExperience callback prop.',
);
assert.match(
  landingSource,
  /<LandingNav\s*\/>/,
  'PublicLandingPage should render the nav without a duplicate CTA callback.',
);
assert.doesNotMatch(
  landingSource,
  /landing-nav-cta/,
  'The nav should not render a CTA button that duplicates the hero primary CTA.',
);
assert.match(
  landingNavSource,
  /className="landing-institution-brand"[\s\S]*LANDING_INSTITUTION_LOCKUPS\.map[\s\S]*className="landing-institution-lockup"/,
  'LandingNav should render the joint institution lockup images on the left.',
);
assert.doesNotMatch(
  landingNavSource,
  /Legal World|法律全流程仿真系统/,
  'LandingNav should not render the old Legal World text brand.',
);
assert.match(
  landingSource,
  /document\.body\.classList\.add\('landing-route'\)[\s\S]*document\.body\.classList\.remove\('landing-route'\)/,
  'PublicLandingPage should toggle the landing-route body class and clean it up on unmount.',
);
assert.match(
  landingSource,
  /<LandingHero[\s\S]*onStartExperience=\{onStartExperience\}[\s\S]*\/>/,
  'PublicLandingPage should render the hero with the start callback.',
);
assert.doesNotMatch(
  landingSource,
  /onOpenMcp|isMcpOpen|LandingMcpModal/,
  'PublicLandingPage should no longer host the MCP modal (MCP now lives on the standalone /mcp page).',
);
assert.match(
  landingSource,
  /<LandingFlow\s*\/>/,
  'PublicLandingPage should render the flow section without an in-page CTA scroll ref.',
);
assert.match(
  readFileSync(landingPagePath, 'utf8'),
  /<LandingHero[\s\S]*\/>\s*<LandingFlow\s*\/>\s*<LandingHeroVisual\s*\/>/,
  'The litigation lifecycle section should appear before the first large courtroom image.',
);
assert.match(
  landingSource,
  /<LandingShowcase\s*\/>/,
  'PublicLandingPage should render the product showcase section.',
);
assert.match(
  landingSource,
  /<LandingCapabilities\s*\/>/,
  'PublicLandingPage should render the capabilities section.',
);
assert.doesNotMatch(
  landingSource,
  /LandingInstitutions|Backed By|研发团队|landing-institutions-section/,
  'PublicLandingPage should not render the removed institutions section.',
);
assert.match(
  landingSource,
  /<LandingFooter\s*\/>/,
  'PublicLandingPage should render the footer.',
);
assert.doesNotMatch(
  landingSource,
  /onViewIntro|handleViewIntro|scrollIntoView|introRef/,
  'The removed intro scroll handler should not remain.',
);

// ---- Hero content ----
assert.match(
  landingSource,
  /<h1 className="landing-title" id="landing-hero-title">\{LANDING_HERO_TITLE\}<\/h1>/,
  'LandingHero should render the hero title.',
);
assert.match(
  landingSource,
  /className="landing-subtitle">\{LANDING_HERO_SUBTITLE\}/,
  'LandingHero should render the hero subtitle.',
);
assert.match(
  landingSource,
  /className="landing-hero-keywords"[\s\S]*LANDING_HERO_EYEBROW\.split\('｜'\)\.map[\s\S]*className="landing-hero-keyword"/,
  'LandingHero should render the eyebrow keywords as a keyword row below the subtitle.',
);
assert.doesNotMatch(
  landingSource,
  /landing-hero-badge|LANDING_HERO_SLOGAN|landing-slogan/,
  'The old hero badge pill and slogan line should be removed from the hero.',
);
assert.doesNotMatch(
  landingSource,
  /landing-hero-flowline|landing-hero-flow-chip|landing-hero-flow-arrow/,
  'The inline lifecycle arrow flow should be removed from the hero.',
);
assert.match(
  landingSource,
  /className="landing-primary-cta" onClick=\{onStartExperience\}/,
  'The primary CTA should invoke onStartExperience.',
);
assert.match(
  landingSource,
  /className="landing-secondary-cta"[\s\S]*href=\{LANDING_PROJECT_URL\}[\s\S]*target="_blank"/,
  'The secondary CTA should link to the external project intro page.',
);
assert.match(
  landingSource,
  /className="landing-secondary-cta-icon"[\s\S]*viewBox="0 0 24 24"/,
  'The secondary CTA should include a GitHub icon.',
);
assert.match(
  landingSource,
  /<div aria-hidden="true" className="landing-hero-atmosphere" \/>/,
  'The hero atmosphere layer should be decorative and hidden from assistive tech.',
);
assert.doesNotMatch(
  landingSource,
  /className="landing-hero-backdrop"/,
  'The first screen should not include a large hero image backdrop.',
);
assert.match(
  landingSource,
  /const LANDING_HERO_BACKDROP = '\/art\/vn\/bg-courtroom\.png'/,
  'The second-screen visual should reuse the real courtroom VN scene asset.',
);
assert.doesNotMatch(
  landingSource,
  /LANDING_SHOWCASE_HERO_IMAGE/,
  'LandingHero should not reuse the generated showcase hero image as the first-screen preview.',
);
assert.match(
  projectInfoSource,
  /LANDING_SHOWCASE_HERO_IMAGE\s*=\s*'\/art\/vn\/bg-document-desk\.png'/,
  'The showcase hero image should reuse the real document task scene.',
);
assert.match(
  projectInfoSource,
  /LANDING_SHOWCASE_ITEMS[\s\S]*bg-document-desk\.png[\s\S]*bg-case-analysis-room\.png/,
  'Showcase rows should reuse real task and scene assets.',
);
assert.doesNotMatch(
  `${landingSource}\n${projectInfoSource}`,
  /\/art\/landing\//,
  'The landing page should not reference the generated landing image directory.',
);

// ---- Flow, showcase, capabilities structure ----
assert.match(
  landingSource,
  /LANDING_FLOW_STEPS\.map/,
  'LandingFlow should render the litigation lifecycle steps from constants.',
);
assert.match(
  landingSource,
  /LANDING_SHOWCASE_ITEMS\.map/,
  'LandingShowcase should render showcase rows from constants.',
);
assert.match(
  landingSource,
  /LANDING_CAPABILITIES\.map/,
  'LandingCapabilities should render capability blocks from constants.',
);
assert.match(
  landingSource,
  /<div className="landing-capability" ref=\{revealRef\}>/,
  'Each capability block should participate in scroll reveal.',
);

// ---- Scroll reveal hook ----
assert.ok(
  existsSync(join(landingDir, 'useRevealOnScroll.ts')),
  'useRevealOnScroll hook should exist.',
);
assert.match(
  landingSource,
  /typeof IntersectionObserver === 'undefined'/,
  'The reveal hook should guard against missing IntersectionObserver.',
);
assert.match(
  landingSource,
  /prefersReducedMotion[\s\S]*IntersectionObserver/,
  'The reveal hook should respect prefers-reduced-motion before observing.',
);

// ---- Hero second-screen cast / no old scene layer ----
assert.match(
  landingSource,
  /LANDING_HERO_CAST[\s\S]*char-lawyer-wang-xiaoming-confident\.png[\s\S]*char-judge-serious\.png[\s\S]*char-defense-lawyer-zhao-xue-confident\.png/,
  'The second-screen image should use the original three-character courtroom cast.',
);
assert.match(
  landingSource,
  /className="landing-hero-visual-section"[\s\S]*className="landing-hero-frame landing-hero-scene-card"[\s\S]*className="landing-hero-scene-backdrop"[\s\S]*LANDING_HERO_CAST\.map/,
  'The landing page should render the courtroom cast image after the lifecycle section.',
);
assert.doesNotMatch(
  landingSource,
  /landing-hero-montage|landing-hero-montage-grid|landing-hero-montage-card/,
  'LandingHero should not render a multi-image montage in the first preview.',
);
assert.doesNotMatch(
  landingSource,
  /landing-scene-figure|landing-scene-cast|landing-scene-backdrop/,
  'The redesigned landing page should remove the old character scene layer.',
);
assert.doesNotMatch(
  landingSource,
  /fetch\(|authenticatedFetch|\blogin\(|\bregister\(/,
  'The landing page should stay presentational and not call auth APIs.',
);

// ---- AuthGate wiring (unchanged) ----
const authGateSource = readFileSync(join(root, 'src', 'components', 'AuthGate.tsx'), 'utf8');

assert.match(
  authGateSource,
  /import \{ PublicLandingPage \} from '\.\/PublicLandingPage';/,
  'AuthGate should import the public landing page.',
);
assert.match(
  authGateSource,
  /type UnauthenticatedView = 'landing' \| 'login';/,
  'AuthGate should model the landing/login view state.',
);
assert.match(
  authGateSource,
  /useState<UnauthenticatedView>\('landing'\)/,
  'AuthGate should default the unauthenticated view to the landing page.',
);
assert.match(
  authGateSource,
  /<PublicLandingPage onStartExperience=\{\(\) => setUnauthenticatedView\('login'\)\} \/>/,
  'AuthGate should render the landing page first and advance to login on start.',
);
assert.match(
  authGateSource,
  /state === 'authenticated' \|\| \(state === 'offline' && unauthenticatedView === 'login'\)/,
  'Offline should render the workspace only after the visitor leaves the landing page.',
);
assert.doesNotMatch(
  authGateSource,
  /auth-toast/,
  'AuthGate should no longer surface the session-restore error toast on the landing entry.',
);
assert.match(
  authGateSource,
  /getWebSocketService\(\)\.send\(\{ type: 'client_logout' \}\)/,
  'AuthGate should keep notifying the WebSocket on intentional logout.',
);
assert.match(
  authGateSource,
  /if \(ensureWorkspace\) \{[\s\S]*await ensureSandbox\(\);[\s\S]*\}/,
  'AuthGate should keep the optional sandbox bootstrap.',
);

// ---- Self-hosted fonts ----
assert.match(
  stylesSource,
  /@font-face\s*\{[\s\S]*font-family:\s*"Lato"[\s\S]*src:\s*url\("\/fonts\/Lato-Light\.woff2"\)[\s\S]*font-weight:\s*300/,
  'styles.css should register the self-hosted Lato Light font.',
);
assert.match(
  stylesSource,
  /@font-face\s*\{[\s\S]*font-family:\s*"Lato"[\s\S]*src:\s*url\("\/fonts\/Lato-Heavy\.woff2"\)[\s\S]*font-weight:\s*900/,
  'styles.css should register the self-hosted Lato Heavy font.',
);
assert.ok(
  existsSync(join(root, 'public', 'fonts', 'Lato-Light.woff2')),
  'Lato-Light.woff2 should be present for offline deployment.',
);
assert.ok(
  existsSync(join(root, 'public', 'fonts', 'Lato-Heavy.woff2')),
  'Lato-Heavy.woff2 should be present for offline deployment.',
);
assert.match(
  indexHtmlSource,
  /<link rel="preload" href="\/fonts\/Lato-Light\.woff2" as="font" type="font\/woff2" crossorigin \/>/,
  'index.html should preload the Lato Light font.',
);
assert.match(
  indexHtmlSource,
  /<link rel="preload" href="\/fonts\/Lato-Heavy\.woff2" as="font" type="font\/woff2" crossorigin \/>/,
  'index.html should preload the Lato Heavy font.',
);
assert.match(
  stylesSource,
  /--font-sans:\s*"PingFang SC",\s*"Microsoft YaHei",\s*system-ui,\s*sans-serif/,
  'The global sans font stack should use PingFang SC as the primary Chinese font.',
);
assert.match(
  stylesSource,
  /--lp-font-display-heavy:\s*var\(--font-title-heavy\)/,
  'The landing display-heavy token should use the global Lato title stack.',
);
assert.match(
  stylesSource,
  /--lp-font-display-light:\s*var\(--font-title-light\)/,
  'The landing display-light token should use the global Lato light title stack.',
);

// ---- Landing styles ----
assert.match(
  stylesSource,
  /\.public-landing,\s*\.mcp-page\s*\{[\s\S]*--lp-bg:\s*#050506/,
  'The landing root (shared with the /mcp page) should define the dark background token.',
);
assert.match(
  stylesSource,
  /\.landing-hero\s*\{[\s\S]*position:\s*relative[\s\S]*overflow:\s*hidden/,
  'The hero should be a self-contained layered stage.',
);
assert.match(
  stylesSource,
  /\.landing-hero\s*\{[\s\S]*min-height:\s*100svh/,
  'The first landing screen should be a full viewport text-only hero.',
);
assert.match(
  stylesSource,
  /\.landing-hero-atmosphere\s*\{[\s\S]*url\('\/art\/vn\/bg-courtroom\.png'\)[\s\S]*filter:\s*blur\(18px\)/,
  'The text-only hero should keep a subtle blurred courtroom atmosphere.',
);
assert.match(
  stylesSource,
  /\.landing-flow\s*\{[\s\S]*min-height:\s*100svh[\s\S]*justify-content:\s*center/,
  'The lifecycle section should fill the screen immediately after the text hero.',
);
assert.match(
  stylesSource,
  /\.landing-hero-visual-section\s*\{[\s\S]*min-height:\s*100svh[\s\S]*align-items:\s*center/,
  'The courtroom visual should remain a full-screen image section after the lifecycle section.',
);
assert.match(
  stylesSource,
  /body\.landing-route\s*\{[^}]*overflow-y:\s*auto/,
  'The landing route should re-enable vertical page scrolling on the body.',
);
assert.match(
  stylesSource,
  /body\.landing-route \.build-version-badge\s*\{[^}]*display:\s*none/,
  'The landing route should hide the build version badge.',
);
assert.doesNotMatch(
  stylesSource,
  /\.landing-institution-logos img\s*\{[^}]*grayscale/,
  'The nav institution logos should keep their original colors.',
);
assert.match(
  stylesSource,
  /\.landing-institution-brand\s*\{[\s\S]*display:\s*flex[\s\S]*\.landing-institution-lockup\s*\{[\s\S]*object-fit:\s*contain/,
  'LandingNav should style the joint institution lockup images.',
);
assert.doesNotMatch(
  stylesSource,
  /landing-institutions-section|landing-institutions-copy|landing-institutions-band|landing-institution-badge/,
  'Removed institutions section styles should not remain.',
);
assert.doesNotMatch(
  stylesSource,
  /\.landing-nav-cta/,
  'The removed nav CTA should leave no orphan styles.',
);
assert.match(
  stylesSource,
  /\.landing-capabilities\s*\{[\s\S]*grid-template-columns:\s*repeat\(3, 1fr\)/,
  'The capabilities section should lay out three blocks.',
);
assert.match(
  stylesSource,
  /@media \(max-width:\s*720px\)[\s\S]*\.landing-capabilities\s*\{[\s\S]*grid-template-columns:\s*1fr/,
  'Capability blocks should stack on mobile.',
);
assert.match(
  stylesSource,
  /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.landing-hero-atmosphere\s*\{[\s\S]*animation:\s*none/,
  'The hero atmosphere pulse should respect prefers-reduced-motion.',
);
assert.match(
  stylesSource,
  /\.landing-title\s*\{[^}]*font-size:\s*clamp\([^)]*rem[^)]*\)/,
  'The hero title should use a fluid clamp() font-size with rem endpoints.',
);
assert.match(
  stylesSource,
  /\.landing-hero-keywords\s*\{[\s\S]*flex-wrap:\s*wrap[\s\S]*justify-content:\s*center/,
  'The hero keyword row should center and wrap on narrow screens.',
);
assert.doesNotMatch(
  stylesSource,
  /\.landing-slogan|\.landing-hero-badge/,
  'Retired slogan and badge styles should leave no orphan rules.',
);
assert.doesNotMatch(
  stylesSource,
  /\.landing-hero-flowline|\.landing-hero-flow-chip|\.landing-hero-flow-arrow/,
  'Retired inline lifecycle flow styles should leave no orphan rules.',
);
assert.match(
  stylesSource,
  /\.landing-primary-cta,\s*\.landing-mcp-cta,\s*\.landing-secondary-cta\s*\{[\s\S]*display:\s*inline-flex[\s\S]*text-decoration:\s*none/,
  'The hero CTA controls should align icon text and avoid link underlines.',
);
assert.doesNotMatch(
  stylesSource,
  /\.landing-mcp-overlay|\.landing-mcp-modal/,
  'The retired MCP modal styles should leave no orphan rules after moving to the /mcp page.',
);
assert.match(
  stylesSource,
  /\.landing-secondary-cta-icon\s*\{[\s\S]*width:\s*18px[\s\S]*height:\s*18px/,
  'The GitHub icon should have a stable compact size.',
);
assert.match(
  stylesSource,
  /\.landing-hero-scene-card\s*\{[\s\S]*aspect-ratio:\s*16 \/ 9/,
  'The restored second-screen image should have one stable 16:9 scene frame.',
);
assert.match(
  stylesSource,
  /\.landing-hero-scene-cast\s*\{[\s\S]*display:\s*flex[\s\S]*justify-content:\s*center/,
  'The restored hero cast should be centered inside the first preview image.',
);
assert.match(
  stylesSource,
  /\.landing-hero-scene-figure\s*\{[\s\S]*height:\s*min\(56vh, 520px\)/,
  'Hero cast figures should use stable viewport-height constrained sizes.',
);
assert.doesNotMatch(stylesSource, /landing-hero-montage/, 'Unused montage styles should be removed.');
assert.doesNotMatch(
  stylesSource,
  /\.landing-title\s*\{[^}]*font-size:\s*[\d.]+vw/,
  'The hero title must not use a raw viewport-width-only font-size.',
);
assert.doesNotMatch(
  stylesSource,
  /landingSceneDrift/,
  'The old character-scene drift animation should be removed.',
);
assert.match(
  stylesSource,
  /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*is-revealed/,
  'Scroll-reveal transitions should be gated behind prefers-reduced-motion: no-preference.',
);

console.log('public-landing-page: OK');
