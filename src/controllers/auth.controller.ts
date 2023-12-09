/** Required External Modules */
import { default as Moralis } from "moralis";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import * as dotenv from "dotenv";

/** Required App Modules */
import User  from "../models/user";

dotenv.config();

const config = {
    domain: String(process.env.APP_DOMAIN),
    statement: "Please sign this message to confirm your identity.",
    uri: String(process.env.REACT_URL),
    timeout: Number(60),
};

export const RequestMessage = async (req: Request, res: Response) => {
    // Controller logic
    const { address, chain, network} = req.body;
    try {
        const message = await Moralis.Auth.requestMessage({
          address: String(address),
          chain: chain,
          ...config,
        });
    
        return res.status(200).json(message);
      } catch (error:any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
       
      }
};

export const Verification = async (req: Request, res: Response) => {
    try {
        const { email, message, signature } = req.body;
        
        const { address, profileId } = (
          await Moralis.Auth.verify({
            message,
            signature,
            networkType: 'evm',
          })
        ).raw;
        
        let userExist = await User.findOne({ email });
        
        if(userExist === null){
            await User.create({
                email,
                address,
                isLender:false,
                isVerified:false
            });

            userExist = await User.findOne({ email });
        }

        
        const jwtObject = { 
            _id: userExist._id,
            email: userExist.email,
            address: userExist.address,
            isLender: userExist.isLender,
            isVerified: userExist.isVerified
        }

        const token = jwt.sign(jwtObject, `${process.env.AUTH_SECRET}`, { expiresIn: "7d"})
        

        res.cookie('jwt', token, {
            httpOnly: true,
        });

        return res.status(200).json({
            userExist,
            token
        });
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
        
    }
}

export const Authenticate = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(403); // if the user did not send a jwt token, they are unauthorized

    try {
        const data = jwt.verify(token, `${process.env.AUTH_SECRET}`);
        return res.json(data);
    } catch {
        return res.sendStatus(403);
    }
}

export const Logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('jwt');
        return res.sendStatus(200);
    } catch {
        return res.sendStatus(403);
    }
}