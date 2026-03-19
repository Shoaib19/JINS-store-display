// 遠中近区分
const PerspectiveTypeCodeTypeList = [
  "000", // 度なし
  "001", // 遠用
  "002", // 近用
  "003", // 遠近
  "004", // 中近
  "005", // 近近
  "007", // サポート
  "008", // Bi-Focal
  "100", // 老眼
  "101", // 中間用
] as const;
export type PerspectiveTypeCodeType =
  (typeof PerspectiveTypeCodeTypeList)[number];
export function isPerspectiveTypeCode(
  perspectiveTypeCode?: string | null,
): perspectiveTypeCode is PerspectiveTypeCodeType {
  return PerspectiveTypeCodeTypeList.some(
    (value) => value === perspectiveTypeCode,
  );
}

// 遠中近区分からレンズピント・焦点分類への変換テーブル
// https://jins.backlog.jp/document/DJ36_DEV_HOSYO/0194ee274743796c836f79c48d2e123b
type PerspectiveTypeCodeMapType = {
  [K in PerspectiveTypeCodeType]: {
    readonly lensPint: string;
    readonly focusCategoryItemCode: string;
  };
};
export const perspectiveTypeCodeMap: PerspectiveTypeCodeMapType = {
  "000": {
    // 度なし
    lensPint: "0",
    focusCategoryItemCode: "LOP-U-110001",
  },
  "001": {
    // 遠用
    lensPint: "1",
    focusCategoryItemCode: "LOP-U-110001",
  },
  "002": {
    // 近用
    lensPint: "2",
    focusCategoryItemCode: "LOP-U-110001",
  },
  "003": {
    // 遠近
    lensPint: "3",
    focusCategoryItemCode: "LOP-U-110004",
  },
  "004": {
    //中近
    lensPint: "4",
    focusCategoryItemCode: "LOP-U-110003",
  },
  "005": {
    // 近近
    lensPint: "5",
    focusCategoryItemCode: "LOP-U-110002",
  },
  "007": {
    // サポート
    lensPint: "7",
    focusCategoryItemCode: "LOP-U-110005",
  },
  "008": {
    // Bi-Focal
    lensPint: "8",
    focusCategoryItemCode: "LOP-U-110006",
  },
  "100": {
    // 老眼
    lensPint: "2",
    focusCategoryItemCode: "LOP-U-110001",
  },
  "101": {
    // 中間用
    lensPint: "1",
    focusCategoryItemCode: "LOP-U-110001",
  },
};
