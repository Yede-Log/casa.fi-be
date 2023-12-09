/** Required External Modules */
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { createLoan, deleteLoan, getAllLoan, getLoanByID, updateLoan } from "../services/loan";
import { getLoanOfferByID } from "../services/loanOffer";


/** Required App Modules */
dotenv.config();

export const createLoanController = async (req: Request, res: Response) => {
  try {
        req.body.createdAt = new Date();
        req.body.updatedAt = new Date();
        await createLoan(req.body);
        return res.status(201).json(req.body);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
};

export const getAllLoanController = async (req: Request, res: Response) => {
    try {
        const loans = await getAllLoan(String(req.query.address));
        let modified_loans:any[] = [];
        for(let i = 0; i < loans.length; i++) {
            let loan_offer = await getLoanOfferByID(String(loans[i].loanOffer));
            modified_loans.push({
                ...loans[i],
                interestRate: loan_offer.interestRate,
                maxTenure: loan_offer.maxTenure,
                maxAmount: loan_offer.maxAmount,    
            })
        }
        return res.status(200).json(modified_loans);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
};

export const getLoanByIDController = async (req: Request, res: Response) => {
    try {
        const loan = await getLoanByID(req.params.id);
        const loan_offer = await getLoanOfferByID(String(loan.loanOffer));
        let modified_loan = {
            ...loan,
            interestRate: loan_offer.interestRate,
            maxTenure: loan_offer.maxTenure,
            maxAmount: loan_offer.maxAmount,
        }
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        return res.status(200).json(modified_loan);
    } catch (error:any) {
          return res.status(400).json({ error: error.message });
      }
};

export const updateLoanController = async (req: Request, res: Response) => {
    try {
        req.body.updatedAt = new Date();
        const updatedLoan = await updateLoan(req.params.id, req.body);
        return res.status(200).json(updatedLoan);
    } catch (error:any) {
       return res.status(500).json({ error: error.message });
    }
};

export const deleteLoanController = async (req: Request, res: Response) => {
    try {
        await deleteLoan(req.params.id);
        return res.status(200).json({ message: 'Loan Application Deleted' });
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};