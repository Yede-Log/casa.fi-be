import { ethers } from "ethers";
import logger from "../config/logger";
import { decodeTopic0 } from "./utils";
import { LogDescription } from "ethers/lib/utils";
import { LOAN_ACCOUNT_CONTRACT_ABI, getContract } from "../config/ethers";
import { sendNotification } from "./notififcations";
import mongoose, { LOANS_COLLECTION } from "../config/database";

export const processLogs = async (logs: LogDescription[]) => {
    for(const log of logs) {
        let event = decodeTopic0(log.topic);
        console.log(`Received event ${event}`);
        let loanAccountContract = getContract(log.args[0], LOAN_ACCOUNT_CONTRACT_ABI);
        let borrower = await loanAccountContract._borrower();
        let lender = await loanAccountContract._lender();
        let title, body, amount;
        switch(event) {
            case "CloseLoanAccount":
                title = `**IMPORTANT MESSAGE FOR ${borrower}**`;
                body = `You have defaulted on your loan: ** ${loanAccountContract.address} **.
                \nMortgaged Asset has been transferred to your lender's acount: ${lender}.`;
                await sendNotification([borrower], title, body);
                title = `**IMPORTANT MESSAGE FOR ${lender}**`;
                body = `Loan Account has been closed: ** ${loanAccountContract.address} **.
                \nMortgaged Asset has been transferred to your account: ${lender}.`;
                await sendNotification([lender], title, body);
                break;
            case "LoanAccountCreated":
                title = `**IMPORTANT MESSAGE FROM Loan Account ${borrower}**`;
                body = `Loan Account has been created: ** ${loanAccountContract.address} **.`;
                await sendNotification([borrower], title, body);
                title = `**IMPORTANT MESSAGE FOR ${lender}**`;
                body = `Loan Account has been created: ** ${loanAccountContract.address} **.`;
                await sendNotification([lender], title, body);
                
                // updating the status to new
                await mongoose.connection.db.collection(LOANS_COLLECTION).updateOne({ loanAccount: `${loanAccountContract.address}` }, {$set: { status: "NEW"}});

                break;
            case "LoanDisbursed":
                amount = log.args[1].toNumber();
                title = `**IMPORTANT MESSAGE FROM LOAN ACCOUNT: ${loanAccountContract.address}**`;
                body = `Loan of amount: ${amount} has been successfully disbursed from account: ** ${loanAccountContract.address} **.`;
                await sendNotification([borrower, lender], title, body);
                
                // updating status in progress
                await mongoose.connection.db.collection(LOANS_COLLECTION).updateOne({ loanAccount: `${loanAccountContract.address}` }, {$set: { status: "IN_PROGRESS"}});

                break;
            case "LoanPayment":
                title = `**IMPORTANT MESSAGE FROM LOAN ACCOUNT: ${loanAccountContract.address}**`;
                body = `Loan repayment received: ${amount} in account: ** ${loanAccountContract.address} **.`;
                await sendNotification([borrower, lender], title, body);
                break;
            case "LoanPaymentReminder":
                amount = log.args[1].toNumber();
                title = `**IMPORTANT MESSAGE FOR ${borrower}**`;
                body = `Please approve Loan Account: ** ${loanAccountContract.address} ** for amount: ** ${amount} **.
                \nMaintain sufficient balance for debit.`;
                await sendNotification([borrower], title, body);
                break;
            default:
                console.log(`Unknown: ${JSON.stringify(log)}`);
                break;
        }
    }
}