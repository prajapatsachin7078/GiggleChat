import { Router } from "express";
import { validateUser } from "../middleware/userMiddleware.js";
import { fetchConversation, sendMessage } from "../controller/chat/message.controller.js";

const router = Router();

router.route("/").post(validateUser, sendMessage);
router.route("/:chatId").get(validateUser, fetchConversation);

export default router;