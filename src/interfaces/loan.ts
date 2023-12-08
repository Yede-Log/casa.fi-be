import mongoose from "../config/database";

export interface Loan {
    _id: mongoose.Types.ObjectId,
    loanAccount: string,
    lender: mongoose.Types.ObjectId,
    borrower: mongoose.Types.ObjectId,
    loanOffer: string,
    loanApplication: mongoose.Types.ObjectId,
    status: LoanStatus,
    createdAt: Date,
    updatedAt: Date,
}

enum LoanStatus {
    NEW,
    IN_PROGRESS,
    COMPLETED,
    DEFAULTED
}
