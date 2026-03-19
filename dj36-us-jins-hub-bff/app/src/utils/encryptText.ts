import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
// 32バイトの鍵（crypto.randomBytes(32)で生成したバイト列）
const bytes = [0x1a, 0x35, 0x6e, 0xbb, 0xf1, 0xa5, 0x4a, 0x16,
               0x1a, 0xe2, 0x1c, 0x44, 0xc9, 0xc8, 0x70, 0x91,
               0xd0, 0x41, 0x78, 0xa1, 0xd7, 0x5b, 0x77, 0xa5,
               0x6f, 0x6b, 0x4c, 0xe4, 0x0c, 0x7d, 0x2e, 0x94];
const key = Buffer.from(bytes); // 32バイトの鍵
const iv = Buffer.alloc(16, 0); // 16バイトのゼロ値IV
const decryptedEncoding = 'utf8';
const encryptedEncoding = 'base64url';

/**
 * テキストの暗号化
 * @param plainText 平文 
 * @returns 暗号化されたテキスト
 */
export function encryptText(plainText: string): string {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedText = cipher.update(plainText, decryptedEncoding, encryptedEncoding);
    encryptedText += cipher.final(encryptedEncoding);
    return encryptedText;
}

/**
 * テキストの復号化
 * @param encryptedText 暗号化されたテキスト
 * @returns 復号化されたテキスト
 */
export function decryptText(encryptedText: string): string | undefined{
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decryptedText = decipher.update(encryptedText, encryptedEncoding, decryptedEncoding);
        decryptedText += decipher.final(decryptedEncoding);
        return decryptedText;
    } catch {
        // 復号できないときはundefinedを返却
        return undefined;
    }
}

