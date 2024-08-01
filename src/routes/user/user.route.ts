import express, { Request, Response , NextFunction} from "express";
const router = express.Router();
import { validateEmail, validatePassword } from "../../utils/users.validation"
import { changePassword, forgotPassword, resetPassword, userLogin, userSignUp, getUserInfo } from '../../controllers/user/user.controller'
import { isAuntheticated } from "../../controllers/user/user.controller";


// Route to create a new user
router.post('/signup',validateEmail, validatePassword, userSignUp);

// Route to login
router.post('/login', validateEmail, validatePassword, userLogin);

router.put('/change-password', changePassword);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password', resetPassword);

router.get('/userInfo', isAuntheticated, getUserInfo);

export default router;
