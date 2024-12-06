import { compactDecrypt, CompactEncrypt, importJWK, KeyLike } from "jose"


export const createEncriptionKey = async (key: string) => {
    const keyBuffer = Buffer.from(key, "utf-8")
    const jwk = {
        kty: "oct",
        k: keyBuffer.toString("base64url")
    }
    return importJWK(jwk, "A256GCM");
}

export const encryptData = async (data: string, key?: string | Uint8Array | KeyLike) => {

    const secretKey = 
        typeof key === 'undefined' 
        ? await createEncriptionKey(process.env.SECRET_KEY.slice(0,32) as string) 
        : (typeof key === 'string' 
            ? await createEncriptionKey(key) 
            : key)

    const plaintext = new TextEncoder().encode(data);
    const encriptedData = await new CompactEncrypt(plaintext)
        .setProtectedHeader({alg: "dir", enc: "A256GCM"})
        .encrypt(secretKey)

    return encriptedData;
}

export const decrypteData = async (data: string, key?: string | Uint8Array | KeyLike) => {
    const secretKey = 
        typeof key === 'undefined' 
        ? await createEncriptionKey(process.env.SECRET_KEY.slice(0,32) as string) 
        : (typeof key === 'string' 
            ? await createEncriptionKey(key) 
            : key)
    const decryptedData = await compactDecrypt(data, secretKey);

    const buffer = decryptedData.plaintext.buffer

    return new TextDecoder().decode(buffer);
}