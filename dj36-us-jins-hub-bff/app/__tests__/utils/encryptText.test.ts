import { logger } from "~/src/logging/logger";
import * as crypto from 'crypto';
import { decryptText, encryptText } from "~/src/utils/encryptText";

describe("encrypt", () => {
  test("キー生成", async () => {
    const key = crypto.randomBytes(32);
    const array = [...new Uint8Array(key)].map(x => `0x${x.toString(16).padStart(2, '0')}`);
    logger.info(`${array.join(', ')}`);
  });

  test("encryptText", async () => {
    const tests = [
        "241230US000001",
        "241230US000001-1",
        "250527US000010",
        "250527US000011",
        "250527US000012",
        "250527US000013",
        "250527US000010-1",
        "250527US000010-2",
        "250527US000011-1",
        "250527US000012-1",
        "250527US000013-1",
    ];
    tests.forEach((plainText) => {
      {
        // 暗号化して復号化したものと平文が一致することを確認
        const encryptedText = encryptText(plainText);
        const decryptedText = decryptText(encryptedText);
        logger.info(`${plainText} → ${encryptedText} → ${decryptedText}`)
        expect(decryptedText).toBe(plainText);
      }
    });
  });
  test("decryptText", async () => {
    interface TestCase {
      encryptedText: string,
      decryptedText: string|undefined,
    }
    const testCases : TestCase[] = [
      { // 受付番号
        encryptedText: "250527US000010",
        decryptedText: undefined,
      },
      { // 商品グループコード
        encryptedText: "250527US000010-1",
        decryptedText: undefined,
      },
      { // 暗号化された受付番号
        encryptedText: "2DU69DvCS7h5iXyxly5yUg",
        decryptedText: "250527US000010",
      },
      { // 改ざん
        encryptedText: "2DU69DvCS7h5iXyxly5yUX",
        decryptedText: undefined,
      },
      { // 暗号化された商品グループコード
        encryptedText: "TVGgHa1XdbklL1f0hcZyy_ueYcu0YjcjqnpKTRecgDo",
        decryptedText: "250527US000010-1",
      },
      { // 改ざん
        encryptedText: "TVGgHa1XdbklL1f0hcZyy_ueYcu0YjcjqnpKTRecgDoX",
        decryptedText: undefined,
      },
    ];
    testCases.forEach((testCase) => {
      {
        const actual = decryptText(testCase.encryptedText);
        expect(actual).toBe(testCase.decryptedText);
      }
    });
  });
});
