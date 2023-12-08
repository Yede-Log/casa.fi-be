import mongoose from "../config/database"

export interface LoanApplication {
    _id: mongoose.Types.ObjectId,
    loan_offer: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
    reason: string,
    documents: string[],
    assetOwner: string,
    assetId: number,
    amount: number,
    tenure: number,
    status: LoanApplicationStatus,
    createdAt: Date,
    updatedAt: Date,
}

enum LoanApplicationStatus {
    PENDING,
    ACCEPTED,
    REJECTED
}