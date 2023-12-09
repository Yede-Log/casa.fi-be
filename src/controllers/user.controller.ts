/** Required External Modules */
import { Request, Response, application } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { getAllUser, getUserByID, updateUserIsVerified } from "../services/user";
import { getLoanApplicationByID, getLoanApplicationByUser } from "../services/loanAppilcation";
import { getLoanOfferByID } from "../services/loanOffer";
import { MyLoan } from "../interfaces/myLoan";
import { User } from "../interfaces/user";
/**  Required App Modules */
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
        const loanApplications = await getLoanApplicationByUser(req.params.id);
        let myLoans:MyLoan[] = [];
        
        for(let i = 0; i < loanApplications.length; i++) {
            let loan_offer = await getLoanOfferByID(String(loanApplications[i].loan_offer));
            myLoans.push({
                application_id: loanApplications[i]._id,
                lender : loan_offer.lender,
                interest_rate: loan_offer.interestRate,
                amount: loanApplications[i].amount,
                status: loanApplications[i].status,
                chainId: loanApplications[i].chainId
            })
        }
        return res.status(200).json(myLoans as unknown as MyLoan[]);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
}

export const updateIsVerified = async (req: Request, res: Response) => {
    try {
        const {userAddress, isVerified} = req.body;
        const updatedUser = await updateUserIsVerified(userAddress.toString(),isVerified);
        return res.status(200).json(updatedUser)        
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
}