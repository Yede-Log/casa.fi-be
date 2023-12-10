import { Request, Response } from "express";
import { getPushSigner } from "../config/notification";

export const sendNotification = async (recipients: string[], title: string, body: string, rpc: string) => {
    const signer = await getPushSigner(rpc);
    signer.channel.send(
        recipients, 
        {
            notification: {
                title: title,
                body: body
            }
        }
    )
    return { channel: signer.info(), title: title, body: body };
}
