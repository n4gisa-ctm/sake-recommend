/**
 * 銘柄カスケード・銘柄カード・味覚マップで使用する実在の日本酒銘柄データ。
 * 「あっ、この日本酒聞いたことある！」を狙うため、
 * 全国的に知名度の高い銘柄・人気銘柄を中心に構成する。
 *
 * sweet: 甘辛（-2=辛口 〜 +2=甘口）、rich: 濃淡（-2=淡麗 〜 +2=濃醇）。
 * 銘柄内の代表的な商品の一般的な評判に基づくおおよその位置づけ（厳密な数値ではない）。
 */
export interface SakeInfo {
  name: string;
  sweet: number;
  rich: number;
}

// [name, sweet, rich]
const DB: [string, number, number][] = [
  // 全国区の有名どころ
  ['獺祭', 1, -0.5], ['十四代', 1.5, 0.5], ['而今', 1, 0.5], ['新政', 0.5, -1],
  ['久保田', -1, -1], ['八海山', -1, -1], ['越乃寒梅', -1.5, -1], ['飛露喜', 0.5, 0.5],
  ['田酒', 0, 0.5], ['鍋島', 1, 0.5], ['黒龍', 0, -0.5], ['梵', 0.5, 0.5],
  ['磯自慢', -0.5, -0.5], ['剣菱', -0.5, 1.5], ['菊正宗', -1.5, 0.5],
  // 北海道・東北
  ['豊盃', 0.5, 0], ['陸奥八仙', 1, 0], ['赤武', 1, 0], ['山本', 0, -0.5],
  ['雪の茅舎', 0.5, 0], ['伯楽星', -0.5, -1], ['日高見', -0.5, -0.5], ['浦霞', -0.5, 0],
  ['一ノ蔵', -0.5, 0], ['寫樂', 1, 0], ['大七', -0.5, 1.5], ['奥の松', 0, 0],
  ['南部美人', 0, 0],
  // 関東・甲信越
  ['仙禽', 1, -0.5], ['花陽浴', 1.5, 0.5], ['澤乃井', -0.5, 0], ['真澄', 0, -0.5],
  ['〆張鶴', -1, -1], ['鶴齢', 0, 0.5], ['緑川', -1, -0.5], ['麒麟山', -1.5, -1],
  ['加茂錦', 1, -0.5], ['楯野川', 0.5, 0], ['出羽桜', 0.5, 0], ['くどき上手', 1, 0.5],
  ['上喜元', 0, 0],
  // 北陸
  ['手取川', 0, -0.5], ['菊姫', -0.5, 1.5], ['天狗舞', -0.5, 1], ['加賀鳶', -1, 0],
  ['立山', -1, -0.5], ['満寿泉', 0, 0], ['勝駒', 0, -0.5], ['開運', 0, 0],
  // 東海・近畿
  ['作', 1, 0], ['醸し人九平次', 1, 0.5], ['蓬莱泉', 0.5, 0.5], ['風の森', 1, 0.5],
  ['みむろ杉', 0.5, 0], ['春鹿', -1, 0], ['梅乃宿', 0.5, 0.5], ['紀土', 0.5, -0.5],
  ['黒牛', 0, 0.5], ['澤屋まつもと', 0, -0.5], ['玉乃光', 0, 0], ['松の司', 0, 0.5],
  ['七本鎗', -0.5, 1],
  // 中国・四国
  ['東洋美人', 1, 0], ['雁木', 0.5, 1], ['五橋', 0.5, 0], ['貴', 0, 0],
  ['雨後の月', 0.5, -0.5], ['賀茂鶴', -0.5, 0.5], ['石鎚', 0, 0], ['酔鯨', -1, -0.5],
  ['亀泉', 1, -0.5], ['土佐鶴', -1.5, -0.5], ['司牡丹', -1, -0.5],
  // 九州
  ['東一', 0.5, 0], ['七田', 0.5, 0.5], ['繁桝', 0.5, 0], ['庭のうぐいす', 0.5, 0],
  ['田中六五', 0, 0], ['若波', 0.5, 0], ['三井の寿', 0, 0], ['産土', 1, -0.5],
];

export const SAKE_DB: SakeInfo[] = DB.map(([name, sweet, rich]) => ({ name, sweet, rich }));

/** 名前 → SakeInfo の索引 */
const BY_NAME = new Map(SAKE_DB.map((s) => [s.name, s]));

export function findSake(name: string): SakeInfo | undefined {
  return BY_NAME.get(name);
}

/** カスケード用の銘柄名リスト */
export const SAKE_NAMES = SAKE_DB.map((s) => s.name);

/** 味覚プロファイルを「やや甘口・淡麗」のような日本語タグにする */
export function tasteLabel(s: SakeInfo): string {
  const sweet =
    s.sweet >= 1 ? '甘口' : s.sweet >= 0.5 ? 'やや甘口' :
    s.sweet <= -1 ? '辛口' : s.sweet <= -0.5 ? 'やや辛口' : '中口';
  const rich =
    s.rich >= 1 ? '濃醇' : s.rich >= 0.5 ? 'やや濃醇' :
    s.rich <= -1 ? '淡麗' : s.rich <= -0.5 ? 'やや淡麗' : 'バランス型';
  return `${sweet}・${rich}`;
}

/**
 * テキスト中に登場する既知の銘柄を検出する（長い名前を優先、重複なし・登場順）。
 * AIの返答から銘柄カードを出すために使う。
 */
const NAMES_BY_LENGTH = [...SAKE_NAMES].sort((a, b) => b.length - a.length);

export function detectSakeNames(text: string): SakeInfo[] {
  const found: { name: string; index: number }[] = [];
  for (const name of NAMES_BY_LENGTH) {
    // 1文字銘柄（作・貴・梵）は一般語に誤マッチしやすいため、括弧書きの場合のみ検出
    const needle = name.length === 1 ? `「${name}」` : name;
    const rawIndex = text.indexOf(needle);
    if (rawIndex === -1) continue;
    const index = name.length === 1 ? rawIndex + 1 : rawIndex;
    // より長い銘柄名の一部として既に検出済みならスキップ
    if (found.some((f) => index >= f.index && index < f.index + f.name.length)) continue;
    found.push({ name, index });
  }
  return found
    .sort((a, b) => a.index - b.index)
    .map((f) => BY_NAME.get(f.name)!)
    .filter(Boolean);
}

/** プールからランダムに count 件（重複なし・不足時は繰り返し）を返す */
export function pickSakeNames(count: number): string[] {
  const shuffled = [...SAKE_NAMES].sort(() => Math.random() - 0.5);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
}
