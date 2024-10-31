import * as CryptoJS from 'crypto-js';

export class EncriptarDesencriptar {
  /// Generar una clave y un IV seguros en producción
  private static key = CryptoJS.enc.Hex.parse('1234567890123456789012345678901234567890123456789012345678901234'); // 32 bytes
  private static iv = CryptoJS.enc.Hex.parse ('12345678901234567890123456789012'); // 16 bytes

  static encrypt(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(text, this.key, {iv: this.iv});
    return encrypted.toString();
  }

  static decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, this.key, {iv: this.iv});
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        throw new Error('Decryption resulted in an empty string');
      }
      return decryptedText;
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  }

}
