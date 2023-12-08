import mongoose from "../config/database"

export interface MyLoan {
    application_id: mongoose.Types.ObjectId,
    lender: string,
    interest_rate : number,
    amount: number,
    status: number,
    chainId: number
}