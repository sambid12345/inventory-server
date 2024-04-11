import express, { Request, Response , NextFunction} from "express";
const router = express.Router();
import { validateEmail, validatePassword } from "../../utils/users.validation"
import UserController from '../../controllers/user/user.controller'

// Route to create a new user
router.post('/signup',validateEmail, validatePassword,UserController.userSignUp);

// Route to login
router.get('/login', validateEmail, validatePassword, UserController.userLogin);

export default router;
