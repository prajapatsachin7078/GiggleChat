import { Router } from "express";
import { validateUser } from "../middleware/userMiddleware.js";
import { sendMessage } from "../controller/chat/message.controller.js";

const router = Router();

router.route("/").post(validateUser, sendMessage);
// router.route("/").get(validateUser, fetchAllMessage);

export default router;