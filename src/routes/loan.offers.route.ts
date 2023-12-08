/** Required External Modules */
import express from "express";

/** Required App Modules */
import { 
    createLoanOfferController, 
    deleteLoanOfferController, 
    getAllLoanOfferController, 
    getLoanOfferByIDController, 
    updateLoanOfferController 
} from "../controllers/loan.offers.controller";

let router = express.Router();

// Create routers here

// create a loan offer
router.post("/", createLoanOfferController);

// get all and by id 
router.get("/", getAllLoanOfferController);
router.get("/:id", getLoanOfferByIDController);

// update a loan
router.put("/:id",updateLoanOfferController)

// delete a loan
router.delete("/:id", deleteLoanOfferController)

export default router;