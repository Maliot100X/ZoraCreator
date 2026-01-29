import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: "gateway.pinata.cloud",
});

export async function uploadToIPFS(json: any) {
    try {
        const upload = await pinata.upload.json(json);
        return `ipfs://${upload.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw error;
    }
}

export async function uploadImageToIPFS(file: File) {
    try {
        const upload = await pinata.upload.file(file);
        return `ipfs://${upload.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading image to IPFS:", error);
        throw error;
    }
}
