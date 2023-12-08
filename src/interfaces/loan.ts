import mongoose from "../config/database";

export interface Loan {
    _id: mongoose.Types.ObjectId,
    loanAccount: string,
    lender: string,
    borrower: string,
    loanOffer: mongoose.Types.ObjectId,
    loanApplication: mongoose.Types.ObjectId,
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