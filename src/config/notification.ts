import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { getSigner } from "./ethers";

let pushSigner: PushAPI;

export const getPushSigner = async () => {
    if (pushSigner == null || pushSigner == undefined) {
        pushSigner = await PushAPI.initialize(getSigner(), { env: CONSTANTS.ENV.STAGING });
    }
    return pushSigner;
}
