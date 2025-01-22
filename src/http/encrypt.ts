import { env } from "./env";

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(env.ENCRYPTION_KEY, 'hex');

export function encrypt(data: string, iv: string) {
    const cipher = crypto.createCipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(data: string, iv: string) {
    if (!iv) {
        throw new Error("IV must be provided for decryption");
    }
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export function newEncrypt(data: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex') as string,
        encryptedData: encrypted as string
    };
}
