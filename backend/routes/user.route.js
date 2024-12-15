import { Router } from "express";
import { singleUpload } from "../middleware/multer.js";
import { userLogin, userSignUp, getUsers, userLogout, userEmailVerification ,verifyOtp} from "../controller/auth/user.controller.js";
import { validateUser } from "../middleware/userMiddleware.js";

const router = Router();

router.route('/verify-email').post(userEmailVerification);
router.route('/verify-otp').post(verifyOtp);
router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);
router.route('/get-users').get(validateUser,getUsers);
router.route('/logout').get(userLogout);

export default router