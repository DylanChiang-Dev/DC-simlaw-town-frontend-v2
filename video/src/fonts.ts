// 加载中文字型（Remotion 的 Chromium 无内建 CJK 字型，必须显式加载）。
import { loadFont as loadSerif } from '@remotion/google-fonts/NotoSerifSC';
import { loadFont as loadSans } from '@remotion/google-fonts/NotoSansSC';

const serif = loadSerif('normal', {
  weights: ['700', '900'],
  subsets: ['chinese-simplified', 'latin'],
});

const sans = loadSans('normal', {
  weights: ['400', '500', '700'],
  subsets: ['chinese-simplified', 'latin'],
});

export const FONT_SERIF = serif.fontFamily;
export const FONT_SANS = sans.fontFamily;
