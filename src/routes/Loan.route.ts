/** Required External Modules */
import express from "express";

/** Required App Modules */
import { 
    createLoanController, 
    getAllLoanController, 
    getLoanByIDController, 
    updateLoanController, 
    deleteLoanController 
} from "../controllers/Loan.controller";

let router = express.Router();

// Create routers here

// create a loan offer
router.post("/create", createLoanController);

// get all and by id 
router.get("/", getAllLoanController);
router.get("/:id", getLoanByIDController);

// update a loan
router.put("/:id",updateLoanController)

// delete a loan
router.delete("/:id", deleteLoanController)

export default router;