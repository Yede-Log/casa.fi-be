/** Required External Modules */
import express from "express";

/** Required App Modules */
import { 
     getAllUsersController,
     getUserByIDController,
     getMyLoansController,
     updateIsVerified
} from "../controllers/user.controller";

let router = express.Router();

// Create routers here


// get all and by id 
router.get("/", getAllUsersController);
router.get("/:id", getUserByIDController);
router.get("/myloans/:id",getMyLoansController);
router.post("/verify/", updateIsVerified)

export default router;