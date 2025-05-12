import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator, userLoginValidator} from '../validators/index.js'
import { registerUser,verifyEmail,loginUser,getCurrentUser,logoutUser,resendVerificationEmail,forgotPasswordRequest,changeCurrentPassword} from "../controllers/auth.controllers.js";
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/verifyJwt.middleware.js'
const router=Router()
router.post("/register",upload.single('avatar'),userRegistrationValidator(),validate,registerUser)
router.post("/verify/:token",verifyEmail)
router.post("/login",userLoginValidator(),validate,loginUser)
router.get("/me",verifyJWT,getCurrentUser)
router.post("/logout",verifyJWT,logoutUser)
router.post("/resendVerificationEmail",resendVerificationEmail)
router.post("/forgotPasswordRequest",forgotPasswordRequest)
router.post("/changePassword/:forgotPasswordToken",changeCurrentPassword)
export default router;