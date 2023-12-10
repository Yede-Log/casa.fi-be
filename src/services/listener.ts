import { ethers } from "ethers";
import { getProvider } from "../config/ethers";
import { processLogs } from "./process";
import { Chain } from "../interfaces/chain";

export const getEventsByContract = async (contract: ethers.Contract, fromBlock: number, toBlock: number, chain: Chain) => {
    try {
        const provider = getProvider(chain.rpc);
        const filter = { address: contract.address, fromBlock: fromBlock, toBlock: toBlock, topics: [] };
        let logs = await provider.getLogs(filter);
        console.log(
            `Logs Recieved from ${contract.address} on ${chain.name} between ${fromBlock} and ${toBlock}:
            ${JSON.stringify(logs)}`
        );
        return logs;
    } catch (err) {
        console.error(`Error in listener.ts: ${err}`);
        return [];
    }
}

export const poll = async (address: string, abi: ethers.ContractInterface, interval: number = 5000, fromBlockNumber: number | null = null, chain: Chain) => {
    const provider = getProvider(chain.rpc);
    const contract = new ethers.Contract(address, abi);
    let fromBlock = fromBlockNumber ?? await provider.getBlockNumber();
    setInterval(async () => {
        let latestBlock = await getProvider(chain.rpc).getBlockNumber()
        let toBlock = fromBlock + 10;
        let logs = (await getEventsByContract(contract, fromBlock, toBlock, chain)).map((log) => { return contract.interface.parseLog(log) });
        if(logs.length > 0) {
            processLogs(logs, chain.rpc);
        }   
        fromBlock = latestBlock;
    }, interval);
}
