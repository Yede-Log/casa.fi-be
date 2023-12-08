import { ethers } from "ethers";

export const decodeTopic0 = (topic0: string) => {
    switch(topic0) {
        case ethers.utils.id("CloseLoanAccount(address)"):
            return "CloseAccount";
        case ethers.utils.id("LoanAccountCreated(address)"):
            return "LoanAccountCreated";
        case ethers.utils.id("LoanDisbursed(address,uint256)"):
            return "LoanDisbursed";
        case ethers.utils.id("LoanPayment(address,uint256)"):
            return "LoanPayment";
        case ethers.utils.id("LoanPaymentReminder(address,uint256)"):
            return "LoanPaymentReminder";
    }
}
