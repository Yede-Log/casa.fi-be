import { ethers } from "ethers";
import mongoose, { CHAINS_COLLECTION } from "../config/database";
import { Chain } from "../interfaces/chain";

export const getAllChains = () => {
    const chains = mongoose.connection.db.collection(CHAINS_COLLECTION).find();
    return chains.toArray() as unknown as Chain[];
}

export const getChain = (chainId: number) => {
    const chains = mongoose.connection.db.collection(CHAINS_COLLECTION).findOne({ chainId : chainId});
    return chains as unknown as Chain;
}

export const addChain = async (chain: Chain) => {
    await mongoose.connection.db.collection(CHAINS_COLLECTION).insertOne(chain);
}

export const addContract = async (chainId: number, name: string, address: string, contract: ethers.ContractInterface) => {
    let chain = mongoose.connection.db.collection(CHAINS_COLLECTION).findOne({ "chainId": chainId }) as unknown as Chain;
    chain.contracts.push({
        name: name,
        address: address
    });
    await mongoose.connection.db.collection(CHAINS_COLLECTION).save(chain);
}
