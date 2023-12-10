import { ethers } from "ethers";
import logger from "../config/logger";
import { decodeTopic0 } from "./utils";
import { LogDescription } from "ethers/lib/utils";
import { LOAN_ACCOUNT_CONTRACT_ABI, getContract } from "../config/ethers";
import { sendNotification } from "./notififcations";
import mongoose, { LOANS_COLLECTION } from "../config/database";
import { updateLoanStatus } from "./loan";
import { getLoanApplicationByLenderBorrower, updateLoanApplication } from "./loanAppilcation";
import { LoanApplicationStatus } from "../interfaces/loanApplication";
import { getLoanOfferByID } from "./loanOffer";

export const processLogs = async (logs: LogDescription[], rpc: string) => {
    for(const log of logs) {
        let event = decodeTopic0(log.topic);
        console.log(`Received event ${event}`);
        console.log(`Log: ${JSON.stringify(log)}`); 
        let loanAccountContract = getContract(log.args[0], LOAN_ACCOUNT_CONTRACT_ABI, rpc);
        let borrower = await loanAccountContract._borrower();
        let lender = await loanAccountContract._lender();
        let assetOwner = await loanAccountContract._asset_owner();
        let mortgaged_asset = await loanAccountContract.get_mortgaged_asset();
        let disbursed_token_asset = await loanAccountContract.get_disbursed_asset();
        let payment_interval = await loanAccountContract._payment_interval();
        let interest_rate = await loanAccountContract._interest_rate();
        console.log(mortgaged_asset);
        let title, body, amount, message;
        switch(event) {
            case "CloseLoanAccount":
                title = `IMPORTANT MESSAGE FOR ${borrower}`;
                body = `You have defaulted on your loan: **${loanAccountContract.address}**.
                \nMortgaged Asset has been transferred to your lender's acount: ${lender}.`;
                await sendNotification([borrower], title, body, rpc);
                title = `IMPORTANT MESSAGE FOR ${lender}`;
                body = `Loan Account has been closed: **${loanAccountContract.address}**.
                \nMortgaged Asset has been transferred to your account: ${lender}.`;
                await sendNotification([lender], title, body, rpc);
                await updateLoanStatus(`${loanAccountContract.address}`,"COMPLETED");
                
                break;
            case "LoanAccountCreated":
                // creation of loan account
                const loanApplication = await getLoanApplicationByLenderBorrower(borrower, lender);
                const loanOffer = await getLoanOfferByID(String(loanApplication.loan_offer));
                const newLoan = {
                    _id: loanAccountContract.address,
                    loanAccount: loanAccountContract.address,
                    lender,
                    borrower,
                    loanOffer:loanApplication.loan_offer,
                    loanApplication: String(loanApplication._id),
                    status: "NEW",
                    chainId: Number(loanApplication.chainId),
                    assetId: mortgaged_asset["_token_id"].toNumber(), 
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                // Notification for borrower
                title = `IMPORTANT MESSAGE FOR ${borrower}`;
                message = `Loan Account has been created: **${loanAccountContract.address}**.
                \nKindly approve the above contract for loan disbursement of **${loanAccountContract.address}**`
                body = {
                    type: "erc20",
                    message: message,
                    amount: loanApplication.amount * 0.25,
                    account: loanAccountContract.address
                };
                await sendNotification([borrower], title, JSON.stringify(body), rpc);

                // Notification for lender
                title = `IMPORTANT MESSAGE FOR ${lender}`;
                message = `Loan Account has been created: **${loanAccountContract.address}**.
                \nKindly approve the above contract for loan disbursement of **${loanAccountContract.address}**`
                body = {
                    type: "erc20",
                    message: message,
                    amount: disbursed_token_asset["_disbursed_amount"].toNumber(),
                    account: loanAccountContract.address,
                    time_period: loanApplication.tenure,
                    payment_interval
                }
                await sendNotification([lender], title, JSON.stringify(body), rpc);

                title = `IMPORTANT MESSAGE FOR ${assetOwner}`;
                message = `Kindly approve the contract ${loanAccountContract.address} for your asset **${mortgaged_asset["_token_id"]}**`;
                body = {
                    type: "erc721",
                    message: message,
                    amount: mortgaged_asset["_token_id"],
                    account: loanAccountContract.address
                }
                await sendNotification([assetOwner], title, JSON.stringify(body), rpc);

                title = `IMPORTANT MESSAGE FOR ${lender}`;
                message = `Kindly start disbursement of the following loan account: **${loanAccountContract.address}**.
                \nKindly approve the above contract for loan disbursement of **${loanAccountContract.address}**`
                body = {
                    type: "disburse",
                    message: message,
                    amount: loanApplication.amount,
                    account: loanAccountContract.address,
                    time_period: loanApplication.tenure,
                    payment_interval,
                    interest_rate:loanOffer.interestRate * 100,
                }
                await sendNotification([lender], title, JSON.stringify(body), rpc);                


                await updateLoanApplication(String(loanApplication._id), { ...loanApplication,status: LoanApplicationStatus.ACCEPTED})
                await mongoose.connection.db.collection(LOANS_COLLECTION).save(newLoan);
                
                break;
            case "LoanDisbursed":
                amount = log.args[1].toNumber();
                title = `IMPORTANT MESSAGE FROM LOAN ACCOUNT: ${loanAccountContract.address}`;
                body = `Loan of amount: ${amount} has been successfully disbursed from account: **${loanAccountContract.address}**.`;
                await sendNotification([borrower, lender], title, body, rpc);
                
                // updating status in progress
                // await mongoose.connection.db.collection(LOANS_COLLECTION).updateOne({ loanAccount: `${loanAccountContract.address}` }, {$set: { status: "IN_PROGRESS"}});
                await updateLoanStatus(`${loanAccountContract.address}`,"IN_PROGRESS");

                break;
            case "LoanPayment":
                title = `IMPORTANT MESSAGE FROM LOAN ACCOUNT: ${loanAccountContract.address}`;
                body = `Loan repayment received: ${amount} in account: **${loanAccountContract.address}**.`;
                await sendNotification([borrower, lender], title, body, rpc);
                break;
            case "LoanPaymentReminder":
                amount = log.args[1].toNumber();
                title = `IMPORTANT MESSAGE FOR ${borrower}`;
                body = `Please approve Loan Account: ** ${loanAccountContract.address} ** for amount: **${amount}**.
                \nMaintain sufficient balance for debit.`;
                await sendNotification([borrower], title, body, rpc);
                break;
            default:
                console.log(`Unknown: ${JSON.stringify(log)}`);
                break;
        }
    }
}
