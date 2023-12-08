/** Required External Modules */
import express from "express";


/** Required App Modules */
import { Authenticate, Logout, RequestMessage, Verification } from "../controllers/auth.controller";


let router = express.Router();

// Create routers here
router.post("/request-message", RequestMessage);
router.post("/verify", Verification);
router.post("/authenticate", Authenticate);
router.get("/logout", Logout)

export default router;