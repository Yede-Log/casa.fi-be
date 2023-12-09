/** Required External Modules */
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { createLoanOffer, deleteLoanOffer, getAllLoanOffer, getLoanOfferByID, updateLoanOffer } from "../services/loanOffer";

/** Required App Modules */
dotenv.config();

export const createLoanOfferController = async (req: Request, res: Response) => {
    try {
        req.body.createdAt = new Date();
        req.body.updatedAt = new Date(); 
        await createLoanOffer(req.body);
        return res.status(200).json(req.body);
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

export const getAllLoanOfferController = async (req: Request, res: Response) => {
    try {
        
        const loanOffers = await getAllLoanOffer();
        return res.status(200).json(loanOffers);
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

export const getLoanOfferByIDController = async (req: Request, res: Response) => {
    try {
        
        const loanOffer = await getLoanOfferByID(req.params.id);

        if (!loanOffer) {
            return res.status(404).json({ message: 'Loan offer not found' });
        }
        return res.status(200).json(loanOffer);
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

export const updateLoanOfferController = async (req: Request, res: Response) => {
    try {
        req.body.updatedAt = new Date();
        const updatedLoan = await updateLoanOffer(req.params.id, req.body);
        return res.status(200).json(updatedLoan);
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

export const deleteLoanOfferController = async (req: Request, res: Response) => {
    try {
        await deleteLoanOffer(req.params.id);
        return res.status(200).json({ message: 'Loan offer Deleted' });
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};