import * as forge from 'node-forge';

export function decrypt(bytes: string) {
  if (!process.env.PASSWORD_SECRET_KEY || !process.env.PASSWORD_IV) {
    throw new Error('Missing environment variables required for encryption');
  }
  try {
    // 如果密钥是 Base64 格式，需要先解码，转换为二进制格式
    const keyBinary = atob(process.env.PASSWORD_SECRET_KEY as string);
    const ivBinary = atob(process.env.PASSWORD_IV as string);
    const secretKey = forge.util.createBuffer(keyBinary);
    const iv = forge.util.createBuffer(ivBinary);
    // atob解码使用 base-64 编码的字符串。
    const atobBytes = atob(bytes);
    // 截取后16位的标签验证数据，并且创建一个 Buffer 对象
    const tagBuffer = forge.util.createBuffer(atobBytes.slice(-16));
    // 截取除了后16位的数据，并且创建一个 Buffer 对象
    const dataBuffer = forge.util.createBuffer(
      atobBytes.slice(0, atobBytes.length - 16),
    );

    // 创建一个 Decipher 对象，用于解密
    const decrypted = forge.cipher.createDecipher('AES-GCM', secretKey);
    // 使用 start 方法，初始化解密
    decrypted.start({
      iv,
      tag: tagBuffer,
      additionalData: 'x-dragon',
      tagLength: 128,
    });

    // 使用 update 方法，将输入的字符串（bytes）编码为 UTF-8，然后创建一个 Buffer 对象，并进行解密更新
    decrypted.update(forge.util.createBuffer(dataBuffer));
    // 完成解密
    const decryptResult = decrypted.finish();

    if (decryptResult) {
      return decrypted.output.toString();
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
}
