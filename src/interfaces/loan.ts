import mongoose from "../config/database";

export interface Loan {
    _id: string,
    loanAccount: string,
    lender: string,
    borrower: string,
    loanOffer: string,
    loanApplication: string,
    status: LoanStatus,
    chainId: number,
    assetId: number 
    createdAt: Date,
    updatedAt: Date,
}

enum LoanStatus {
    NEW,
    IN_PROGRESS,
    COMPLETED,
    DEFAULTED
}