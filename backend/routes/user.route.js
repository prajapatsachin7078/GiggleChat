import { Router } from "express";
import { singleUpload } from "../middleware/multer";
import { userSignUp } from "../controller/auth/user.controller";

const router = Router();


router.route("/signup").post(singleUpload, userSignUp);
router.route("/signup").post(userLogin);

export default router