import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const {
  PERSON_PORTRAITS,
  ORG_PORTRAITS,
  CATEGORY_CGS,
  CG_BY_CAUSE,
  FALLBACK_CG_CODE,
} = await import(join(root, 'src', 'data', 'caseArtAssets.ts'));

assert.equal(PERSON_PORTRAITS.length, 20, '自然人立绘应为 20 张');
assert.equal(ORG_PORTRAITS.length, 6, '组织立绘应为 6 张');
assert.equal(Object.keys(CATEGORY_CGS).length, 10, '分类 CG 应为 10 张');
assert.equal(new Set(PERSON_PORTRAITS.map((p) => p.code)).size, 20, '立绘编码不得重复');

const CAUSES = [
  '民间借贷纠纷',
  '劳动争议',
  '买卖合同纠纷',
  '机动车交通事故责任纠纷',
  '商品房预售合同纠纷',
  '房屋买卖合同纠纷',
  '合同纠纷',
  '商品房销售合同纠纷',
  '房屋租赁合同纠纷',
  '建设工程施工合同纠纷',
  '生命权、健康权、身体权纠纷',
  '租赁合同纠纷',
  '物业服务合同纠纷',
  '劳务合同纠纷',
  '劳动合同纠纷',
  '财产损害赔偿纠纷',
  '提供劳务者受害责任纠纷',
  '不当得利纠纷',
  '财产保险合同纠纷',
  '排除妨害纠纷',
];

for (const cause of CAUSES) {
  assert.ok(CG_BY_CAUSE[cause], `案由 ${cause} 缺少 CG 映射`);
  assert.ok(CATEGORY_CGS[CG_BY_CAUSE[cause]], `案由 ${cause} 映射到不存在的 CG code`);
}
assert.ok(CATEGORY_CGS[FALLBACK_CG_CODE], '兜底 CG code 必须存在');

const allPaths = [
  ...PERSON_PORTRAITS.map((p) => p.path),
  ...ORG_PORTRAITS.map((p) => p.path),
  ...Object.values(CATEGORY_CGS),
];

for (const webPath of allPaths) {
  const filePath = join(root, 'public', webPath.replace(/^\//, ''));
  const stat = statSync(filePath);
  assert.ok(stat.size > 0 && stat.size <= 1.5 * 1024 * 1024, `${webPath} 超过 1.5MB，需压缩`);
}

console.log('case-art-pool-assets: all assertions passed');
