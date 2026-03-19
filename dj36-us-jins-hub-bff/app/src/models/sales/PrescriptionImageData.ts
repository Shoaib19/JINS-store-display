import { MAXIMUM_IMAGE_BYTE_SIZE } from "~/src/components/const";

/**
 * 処方箋画像ユーティリティクラス
 */

export class PrescriptionImageData {
  private static readonly maxSize = MAXIMUM_IMAGE_BYTE_SIZE;
  /**
   * 画像サイズチェック
   * @param imageData - 画像データ
   * @returns boolean
   */
  public static isCollectImageSize(imageData: string): boolean {
    // Buffer.byteLength(imageData, "utf8");
    // const image_size = Buffer.from(imageData).length;
    // 元の画像サイス(概算)を取得
    const calcDecodeSize = (encodeData: string) => {
      const encodeLength = Buffer.from(encodeData).length;
      const match = encodeData.match(/=+$/);
      return (
        Math.ceil(encodeLength * 3 / 4) -
        (match ? match[0].length : 0) -
        (4 - encodeLength % 4)
      );
    };
    const image_size = calcDecodeSize(imageData);
    if (this.maxSize < image_size) {
      return false;
    } else {
      return true;
    }
  }
  /**
   * 画像フォーマットチェック
   * @param imageData - 画像データ
   * @returns boolean
   */
  public static isCollectImageFormat(imageData: string): boolean {
    if (this.isJPEGImage(imageData) || this.isPNGImage(imageData)) {
      return true;
    }
    return false;
  }

  /**
   * JPG画像チェック
   * @param imageData - 画像データ
   * @returns boolean
   */
  private static isJPEGImage(imageData: string): boolean {
    // NOTE: The reference is https://programming.earthonline.us/how-to-detect-file-type-using-javascript-251f67679035
    // NOTE: JPEG -> 0xFF D8 FF -> /9j
    const pattern_jpg = "/9j";
    if (imageData.indexOf(pattern_jpg) === 0) {
      return true;
    }
    return false;
  }

  /**
   * PNG画像チェック
   * @param imageData - 画像データ
   * @returns boolean
   */
  private static isPNGImage(imageData: string): boolean {
    // NOTE: The reference is https://programming.earthonline.us/how-to-detect-file-type-using-javascript-251f67679035
    // NOTE: PNG -> 0x89 50 4E 47 0D 0A 1A 0A -> iVBOR
    const pattern_png = "iVBOR";
    if (imageData.indexOf(pattern_png) === 0) {
      return true;
    }
    return false;
  }

  /**
   * 画像URI作成
   * @param imageData - 画像データ
   * @returns 画像URI
   */
  public static makeImageURI(imageData: string): string {
    if (this.isJPEGImage(imageData)) {
      return `data:image/jpeg;base64,${imageData}`;
    }
    if (this.isPNGImage(imageData)) {
      return `data:image/png;base64,${imageData}`;
    }
    if (
      imageData.indexOf(`data:image/jpeg;base64,`) === 0 ||
      imageData.indexOf(`data:image/png;base64,`) === 0
    ) {
      return imageData;
    }
    throw new Error(
      "Invalid image upload format. Please upload a file in JPG or PNG format.",
    );
  }
}
