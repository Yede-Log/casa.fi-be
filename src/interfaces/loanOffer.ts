import mongoose from "../config/database"

export interface LoanOffer {
    _id: mongoose.Types.ObjectId,
    lender: mongoose.Types.ObjectId,
    institutionType: string,
    features: string[],
    interestRate: number,
    maxTenure: number,
    maxAmount: number,
    floating: boolean,
    acceptance: number,
    documentsRequired: string[],
    description: string,
    chainId: number,
    createdAt: Date,
    updatedAt: Date,
}