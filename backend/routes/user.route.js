import { Router } from "express";
import { singleUpload } from "../middleware/multer.js";
import { userLogin, userSignUp,getUsers } from "../controller/auth/user.controller.js";
import { validateUser } from "../middleware/userMiddleware.js";

const router = Router();


router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);
router.route('/get-users').get(validateUser,getUsers);

export default router