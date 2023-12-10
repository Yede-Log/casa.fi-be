import { Request, Response } from "express";
import { getPushSigner } from "../config/notification";

export const sendNotification = async (request: Request, response: Response, rpc: string) => {
    let recipients = request.body.recipients as string[];
    let title = request.body.title as string;
    let body = request.body.body as string;
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
