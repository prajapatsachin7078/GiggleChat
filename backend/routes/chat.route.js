import { Router } from "express";
import { validateUser } from "../middleware/userMiddleware.js";
import { accessChat, fetchChats, createGroup, renameGroup,leaveGroup, removeGroup,removeFromGroup, addToGroup } from "../controller/chat/chat.controller.js";

const router = Router();

// chat routes
router.route("/").post(validateUser,accessChat);
router.route("/").get(validateUser,fetchChats);

// Group routes
router.route("/group").post(validateUser,createGroup);
router.route("/delete/:groupId").delete(validateUser, removeGroup);
router.route("/leave/:groupId").put(validateUser,leaveGroup);
router.route("/rename/:groupId/:newName").put(validateUser, renameGroup);
router.route("/remove/:groupId/:memberId").put(validateUser,removeFromGroup);
router.route("/add/:groupId/:memberId").put(validateUser,addToGroup);

export default router;