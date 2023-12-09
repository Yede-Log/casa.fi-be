import mongoose from "../config/database"

export interface LoanApplication {
    _id: mongoose.Types.ObjectId,
    loan_offer: mongoose.Types.ObjectId,
    borrower: string,
    lender:string,
    reason: string,
    documents: string[],
    assetOwner: string,
    assetId: number,
    amount: number,
    tenure: number,
    chainId: number,
    status: LoanApplicationStatus,
    createdAt: Date,
    updatedAt: Date,
}

export enum LoanApplicationStatus {
    PENDING,
    ACCEPTED,
    REJECTED
}