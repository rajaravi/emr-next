import CryptoJS from 'crypto-js';

const secretKey: string = process.env.SECRET_KEY || 'your-secret-key';

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
