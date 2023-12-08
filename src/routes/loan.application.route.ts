/** Required External Modules */
import express from "express";
import { 
    createLoanApplicationController, 
    deleteLoanApplicationController, 
    getAllLoanApplicationsController, 
    getLoanApplicationByIDController, 
    updateLoanApplicationController
} from "../controllers/loan.application.controller";

/** Required App Modules */

let router = express.Router();

// Create routers here

// create a loan offer
router.post("/apply", createLoanApplicationController);

// get all and by id 
router.get("/", getAllLoanApplicationsController);
router.get("/:id", getLoanApplicationByIDController);

// update a loan
router.put("/:id",updateLoanApplicationController)

// delete a loan
router.delete("/:id", deleteLoanApplicationController)

export default router;