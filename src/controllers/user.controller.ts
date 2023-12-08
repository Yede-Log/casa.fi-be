/** Required External Modules */
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { getAllUser, getUserByID } from "../services/user";
import { getLoanApplicationByID, getLoanApplicationByUser } from "../services/loanAppilcation";
import { getLoanOfferByID } from "../services/loanOffer";
/** Required App Modules */
dotenv.config();



export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUser();
        console.log(users)
        return res.status(200).json(users);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
};

export const getUserByIDController = async (req: Request, res: Response) => {
    try {
        const user = await getUserByID(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        return res.status(200).json(user);
    } catch (error:any) {
          return res.status(400).json({ error: error.message });
      }
};


export const getMyLoansController = async (req: Request, res: Response) => {
    try {
        const loanApplication = await getLoanApplicationByUser(req.params.id);
        const loan_offer = await getLoanOfferByID(String(loanApplication.loan_offer));
        const myLoan = {
            application_id: loanApplication._id,
            lender : loan_offer.lender,
            interest_rate: loan_offer.interestRate,
            amount: loanApplication.amount,
            status: loanApplication.status,
            chainId: loanApplication.chainId   
        }
        return res.status(200).json(myLoan);
    } catch (error:any) {
        
    }
}