import { ethers } from "ethers";
import { getProvider } from "../config/ethers";
import { processLogs } from "./process";

export const getEventsByContract = async (contract: ethers.Contract, fromBlock: number, toBlock: number, rpc: string) => {
    try {
        const provider = getProvider(rpc);
        const filter = { address: contract.address, fromBlock: fromBlock, toBlock: toBlock, topics: [] };
        let logs = await provider.getLogs(filter);
        console.log(
            `Logs Recieved from ${contract.address} on ${(await provider.getNetwork()).name} between ${fromBlock} and ${toBlock}:
            ${JSON.stringify(logs)}`
        );
        return logs;
    } catch (err) {
        console.error(`Error in listener.ts: ${err}`);
        return [];
    }
}

export const poll = async (address: string, abi: ethers.ContractInterface, interval: number = 5000, fromBlockNumber: number | null = null, rpc: string) => {
    const provider = getProvider(rpc);
    const contract = new ethers.Contract(address, abi);
    let fromBlock = fromBlockNumber ?? await provider.getBlockNumber();
    setInterval(async () => {
        let latestBlock = await getProvider(rpc).getBlockNumber()
        let toBlock = fromBlock + 10;
        let logs = (await getEventsByContract(contract, fromBlock, toBlock, rpc)).map((log) => { return contract.interface.parseLog(log) });
        if(logs.length > 0) {
            processLogs(logs, rpc);
        }   
        fromBlock = latestBlock;
    }, interval);
}
