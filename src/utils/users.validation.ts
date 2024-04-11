import express, { Request, Response , NextFunction} from "express";
const router = express.Router();

const validateEmail = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com/;
    if(!emailRegex.test(email)){
        return res.status(500).json({ message: 'Invalid email format' });
    }else{
        next();
    }
};
const validatePassword = (req : Request, res : Response, next: NextFunction)=>{
    const { password } = req.body;
    const minLength = 8; // Rule 1: Minimum length of 8 characters
    const uppercaseRegex = /[A-Z]/; // Rule 2: At least one uppercase letter
    const lowercaseRegex = /[a-z]/; // Rule 3: At least one lowercase letter
    const digitRegex = /[0-9]/; // Rule 4: At least one digit
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // Rule 5: At least one special character

    // Check if password meets all rules
    const isLengthValid = password.length >= minLength;
    const hasUppercase = uppercaseRegex.test(password);
    const hasLowercase = lowercaseRegex.test(password);
    const hasDigit = digitRegex.test(password);
    const hasSpecialChar = specialCharRegex.test(password);

    // Return true if all rules are met, false otherwise
    if(isLengthValid && hasUppercase && hasLowercase && hasDigit && hasSpecialChar){
        next();
    }else{
        return res.status(500).json({ message: 'Invalid Password'});
    }
}


export {
    validateEmail,
    validatePassword
}