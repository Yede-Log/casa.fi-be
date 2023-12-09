import mongoose, { LOAN_APPLICATIONS_COLLECTION } from "../config/database";
import logger from "../config/logger";
import { LoanApplication } from "../interfaces/loanApplication";

const ObjectId = mongoose.Types.ObjectId

export const createLoanApplication = async (loanApplication: LoanApplication) => {
    try {
        await mongoose.connection.db.collection(LOAN_APPLICATIONS_COLLECTION).insertOne(loanApplication);
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const getAllLoanApplications = async (user:string) => {
    try {
        let loanApplications = await mongoose.connection.db.collection(LOAN_APPLICATIONS_COLLECTION).find({$or: [ { lender: { $lt: user } }, { borrower: user } ]});
        return loanApplications.toArray() as unknown as LoanApplication[];
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const getLoanApplicationByID = async (id: string) => {
    try {
        let loanApplication = await mongoose.connection.db.collection(LOAN_APPLICATIONS_COLLECTION).findOne({_id: new ObjectId(id)});
        return loanApplication as unknown as LoanApplication;
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const updateLoanApplication = async (id:string, loanApplication: LoanApplication) => {
    try {
        await mongoose.connection.db.collection(LOAN_APPLICATIONS_COLLECTION).updateOne({ _id: new ObjectId(id)}, {$set: {...loanApplication}});
        let updatedLoanApplication = await mongoose.connection.db.collection(LOAN_APPLICATIONS_COLLECTION).findOne({_id: new ObjectId(id)});
        return updatedLoanApplication as unknown as LoanApplication;
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const deleteLoanApplication = async (id: string) => {
    try {
        await mongoose.connection.db.collection(LOAN_APPLICATIONS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const getLoanApplicationByUser = async (borrower: string) => {
    try {
        let loanApplications = await mongoose.connection.db.collection(LOAN_APPLICATIONS_COLLECTION).find({ borrower:borrower });
        return loanApplications.toArray() as unknown as LoanApplication[];
        
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};

export const getLoanApplicationByLenderBorrower = async(borrower: string, lender: string) => {
    try {
        const loanApplication = await mongoose.connection.db.collection(LOAN_APPLICATIONS_COLLECTION).findOne({borrower: borrower, lender: lender});
        console.log("service", loanApplication);
        return loanApplication as unknown as LoanApplication;
    } catch (err:any) {
        console.error(`Error in gettin loan application: \n${err}`);
        throw err;
    }
} 