/** Required External Modules */
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { createLoanApplication, deleteLoanApplication, getAllLoanApplications, getLoanApplicationByID, updateLoanApplication } from "../services/loanAppilcation";
import { getLoanOfferByID } from "../services/loanOffer";

/** Required App Modules */
dotenv.config();

export const createLoanApplicationController = async (req: Request, res: Response) => {
    try {
        req.body.createdAt = new Date();
        req.body.updatedAt = new Date();
        const loan_offer = await getLoanOfferByID(req.body.loan_offer);
        req.body.lender = loan_offer.lender;
        await createLoanApplication(req.body);
        return res.status(201).json(req.body);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }

};

export const getAllLoanApplicationsController = async (req: Request, res: Response) => {
    try {
        const loanApplications = await getAllLoanApplications(String(req.query.address));
        return res.status(200).json(loanApplications);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
};

export const getLoanApplicationByIDController = async (req: Request, res: Response) => {
    try {
        const loanApplication = await getLoanApplicationByID(req.params.id);
        if (!loanApplication) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        return res.status(200).json(loanApplication);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
};

export const updateLoanApplicationController = async (req: Request, res: Response) => {
    try {
        req.body.updatedAt = new Date();
        const updatedLoanApplication = await updateLoanApplication(req.params.id, req.body);
        return res.status(200).json(updatedLoanApplication);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
};

export const deleteLoanApplicationController = async (req: Request, res: Response) => {
    try {
        await deleteLoanApplication(req.params.id);
        return res.status(200).json({ message: 'Loan Application Deleted' });
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};