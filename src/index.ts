/** Required External Modules */
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { default as Moralis } from "moralis";

/** Required App Modules */
// import Logger from "./config/logger";
import mongoose, { CHAINS_COLLECTION, connectDB } from "./config/database";

/** Required Routes Module */
import authRoutes from "./routes/auth.route";
import loanOfferRoutes from "./routes/loan.offers.route";
import loanApplicationRoutes from "./routes/loan.application.route";
import loanRoutes from "./routes/Loan.route";
import userRoutes from "./routes/user.route";

import { poll } from "./services/listener";
import { LOAN_REGISTRY_CONTRACT_ABI, getProvider } from "./config/ethers";
import { addChain, getAllChains, getChain } from "./services/chain";
import { sendNotification } from "./services/notififcations";
const lighthouse_api_key = process.env.LIGHT_HOUSE

dotenv.config();



const PORT: number = parseInt(process.env.PORT ?? "8080");

const app = express();

/** App Configuration */
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/*
* allowing access to frontend domain
*/
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)

app.use("/api/auth", authRoutes)                                /** test done */
app.use("/api/loan-offers", loanOfferRoutes)                    /** test done */
app.use("/api/loan-application", loanApplicationRoutes);        /** test done */
app.use("/api/loan", loanRoutes);                               /** test done */
app.use("/api/user", userRoutes);
app.get("/api/healthcheck", (req, res) => {
  let message:string = "Hello world";
  return res.status(200).json(message);
})

app.post("/api/chains", async (request: Request, response: Response) => {     /** Testing done  */
    const chain = {
        _id: new mongoose.Types.ObjectId(request.body.chainId),
        chainId: request.body.chainId,
        name: request.body.name,
        rpc: request.body.rpc,
        contracts: request.body.contracts,
        syncedBlock: null,
        createdAt: new Date(),
        updateAt: new Date()
    }
    await addChain(chain);
    response.status(200).json({ chainId: chain.chainId, name: chain.name, rpc: chain.rpc });
});


app.get("/api/chains", async(req: Request, res: Response) => {
    const chains = await getAllChains();
    res.status(200).json(chains)
})


/** Server Activation */
const StartServer = async() => {
  await connectDB();

  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

    let chains = await getAllChains();
    const name="LoanRegistry"

    for (let chain of chains) {
        const contractIndex = await chain.contracts.findIndex((chainContract) => chainContract.name === name);
        let latestBlock = await getProvider(chain.rpc).getBlockNumber()
        await poll(chain.contracts[contractIndex].address, LOAN_REGISTRY_CONTRACT_ABI, 10000, latestBlock, chain.rpc);
    }
}

StartServer();