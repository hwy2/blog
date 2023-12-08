import CryptoJS from "crypto-js";
// key
let key: any = import.meta.env.VITE_GLOB_APP_KEY;
key = CryptoJS.enc.Utf8.parse(key)

// 解密
export const declassificationAES = (encryptedData: string) => {

    const decryptedContent = CryptoJS.AES.decrypt(
        CryptoJS.format.Hex.parse(encryptedData),
        key,//注意：后面这里最好使用 CryptoJS.format.Utf8.parse(key) 
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    return JSON.parse(CryptoJS.enc.Utf8.stringify(decryptedContent))
}
// 加密
export const encryptedAES= (data:any) =>{
    const content = JSON.stringify(data);
    const encryptedContent = CryptoJS.AES.encrypt(content, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encryptedContent.ciphertext.toString();
}