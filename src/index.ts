/** Required External Modules */
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { default as Moralis } from "moralis";

/** Required App Modules */
// import Logger from "./config/logger";
import mongoose, { connectDB } from "./config/database";

/** Required Routes Module */
import authRoutes from "./routes/auth.route";
import loanOfferRoutes from "./routes/loan.offers.route";
import loanApplicationRoutes from "./routes/loan.application.route";
import loanRoutes from "./routes/Loan.route";
import { poll } from "./services/listener";
import { LOAN_REGISTRY_CONTRACT_ABI } from "./config/ethers";
import { addChain } from "./services/chain";
import { sendNotification } from "./services/notififcations";

dotenv.config();

connectDB();

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

app.get("/api/healthcheck", (req, res) => {
  let message:string = "Hello world";
  return res.status(200).json(message);
})

app.post("/api/notifications", async (request: Request, response: Response) => {
    let recipients = request.body.recipients as string[];
    let title = request.body.title as string;
    let body = request.body.body as string;

    let res = await sendNotification(recipients, title, body);
    response.status(200).json(res);
});


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

/** Server Activation */
const StartServer = async() => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

//   await poll("0x7b0dcc7bff658dea11397f5a4ed5f96e0215fe82", LOAN_REGISTRY_CONTRACT_ABI, 10000, 43165317);

}

StartServer();