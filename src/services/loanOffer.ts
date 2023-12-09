import mongoose, { LOAN_OFFERS_COLLECTION } from "../config/database";
import logger from "../config/logger";
import { LoanOffer } from "../interfaces/loanOffer";

const ObjectId = mongoose.Types.ObjectId

export const createLoanOffer = async (offer: LoanOffer) => {
    try {
        await mongoose.connection.db.collection(LOAN_OFFERS_COLLECTION).insertOne(offer);
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const getAllLoanOffer = async (user: string) => {
    try {
        let offers = await mongoose.connection.db.collection(LOAN_OFFERS_COLLECTION).find({$or: [ { lender: { $lt: user } }, { borrower: user } ]});
        return offers.toArray() as unknown as LoanOffer[];
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const getLoanOfferByID = async (id: string) => {
    try {
        let offer = await mongoose.connection.db.collection(LOAN_OFFERS_COLLECTION).findOne({_id: new ObjectId(id)});
        return offer as unknown as LoanOffer;
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const updateLoanOffer = async (id: string, offer: LoanOffer) => {
    try {
        await mongoose.connection.db.collection(LOAN_OFFERS_COLLECTION).updateOne({ _id: new ObjectId(id)}, {$set: {...offer}});
        let updatedOffer = await mongoose.connection.db.collection(LOAN_OFFERS_COLLECTION).findOne({_id: new ObjectId(id)});
        return updatedOffer as unknown as LoanOffer;
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const deleteLoanOffer = async (id: string) => {
    try {
        await mongoose.connection.db.collection(LOAN_OFFERS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};