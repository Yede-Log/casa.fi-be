import mongoose, { LOANS_COLLECTION } from "../config/database";
import { Loan } from "../interfaces/loan";
import logger from "../config/logger";

const ObjectId = mongoose.Types.ObjectId

export const createLoan = async (loan: Loan) => {
    try {
        await mongoose.connection.db.collection(LOANS_COLLECTION).insertOne(loan);
    } catch (err:any) {
        console.error(`Error in creating loan: \n${err}`);
        throw err;
    }
};
  
export const getAllLoan = async (user: string) => {
    try {
        let loans = await mongoose.connection.db.collection(LOANS_COLLECTION).find({$or: [ { lender: { $lt: user } }, { borrower: user } ]});
        return loans.toArray() as unknown as Loan[];
    } catch (err:any) {
        console.error(`Error in fetching all loans: \n${err}`);
        throw err;
    }
};
  
export const getLoanByID = async (id: string) => {
    try {
        let loan = await mongoose.connection.db.collection(LOANS_COLLECTION).findOne({ _id: new ObjectId(id)});
        return loan as unknown as Loan;
    } catch (err:any) {
        console.error(`Error in fetching all loans: \n${err}`);
        throw err;
    }
};
  
export const updateLoan = async (id: string, loan: Loan) => {
    try {
        await mongoose.connection.db.collection(LOANS_COLLECTION).updateOne({ _id: new ObjectId(id)}, {$set: {...loan}});
        let updatedLoan = await mongoose.connection.db.collection(LOANS_COLLECTION).findOne({_id: new ObjectId(id)});
        return updatedLoan as unknown as Loan;
    } catch (err:any) {
        console.error(`Error in fetching all loans: \n${err}`);
        throw err;
    }
};
  
export const deleteLoan = async (id: string) => {
    try {
        await mongoose.connection.db.collection(LOANS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    } catch (err:any) {
        console.error(`Error in fetching all loans: \n${err}`);
        throw err;
    }
};

export const updateLoanStatus = async (loanAccount: string, status: string) => {
    try {
        await mongoose.connection.db.collection(LOANS_COLLECTION).updateOne({ loanAccount: loanAccount}, {$set: {status : status}});
        let updatedLoan = await mongoose.connection.db.collection(LOANS_COLLECTION).findOne({ loanAccount: loanAccount });
        return updatedLoan as unknown as Loan;
    } catch (err:any) {
        console.error(`Error in fetching all loans: \n${err}`);
        throw err;
    }
};