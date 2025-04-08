import forge from "node-forge";

/**
 * @description: 使用AES-GCM算法加密给定的字节
 * @param {string} bytes
 * @return {*}
 */
export function encrypt(bytes: string) {
  if (!process.env.NEXT_PUBLIC_SECRET_KEY || !process.env.NEXT_PUBLIC_IV) {
    throw new Error("Missing environment variables required for encryption");
  }

  try {
    const keyBinary = atob(process.env.NEXT_PUBLIC_SECRET_KEY as string);
    const ivBinary = atob(process.env.NEXT_PUBLIC_IV as string);
    // 创建一个 Buffer 对象，用于存储密钥
    const secretKey = forge.util.createBuffer(keyBinary, "raw");
    // 创建一个 Buffer 对象，用于存储初始化向量
    const iv = forge.util.createBuffer(ivBinary, "raw");
    // 创建一个 Cipher 对象，用于加密
    const cipher = forge.cipher.createCipher("AES-GCM", secretKey);
    cipher.start({
      // 初始化向量，用于增加加密安全性
      iv,
      // 附加数据，确保数据完整性
      additionalData: "x-dragon", // optional
      // 验证标签长度
      tagLength: 128, // optional, defaults to 128 bits
    });
    // 使用 update 方法，将输入的字符串（bytes）编码为 UTF-8，然后创建一个 Buffer 对象，并进行加密更新
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(bytes)));
    // 完成加密
    cipher.finish();
    // 获取加密结果
    const encrypted = cipher.output;
    const tag = cipher.mode.tag;

    // 将加密结果和验证标签进行 base64 编码
    return btoa(encrypted.data + tag.data);
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed");
  }
}
