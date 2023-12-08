import express from "express";
import { sendNotification } from "../controllers/notifications.controller";

const router = express.Router();

router.post("/", sendNotification);

export default router;
