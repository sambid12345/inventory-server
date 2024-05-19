import dotenv from "dotenv";
import User from '../../models/user.model'
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRequest } from "../../models/Request.model";
import Token from "../../models/token.model";
import { transporter } from "../../utils/emailSender";
import { generateRandomString } from "../../utils/tokenGenerator";

dotenv.config();

let JWT_SECRET : string

interface DecodedToken extends JwtPayload {
  userId: string;
}

export async function userSignUp (req : UserRequest, res : Response)  {
    
  try {
    // Extract user details from request body
    const { username, email, password, role} = req.body;

    // Check if user with the provided email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the provided email or username already exists' });
    }

    // Hash the password using bcrypt (includes salting)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function userLogin (req: UserRequest, res : Response, next : NextFunction){
    try {
        const { email, password } = req.body;
  
        // Check if user exists with the provided email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
  
        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        JWT_SECRET = generateRandomString(32);

        // Generate JWT token for authentication
        let expirationTime = '1h';
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: expirationTime });

        // Respond with success message
        res.status(200).json({ message: 'Login successful', token, tokenExpiration: expirationTime === '1h'? 3600000:0 });
      } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


export async function isAuntheticated (req: UserRequest, res: Response, next: NextFunction){
  try {
    // Extract JWT token from request headers
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // Check if user exists in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid authorization token' });
    }

    // Attach user object to request for further middleware or route handlers to access
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log('error', error);
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
}

export async function changePassword (req: Request, res: Response,next: NextFunction){
  const { usermail, currentPassword, newPassword } = req.body;


  if (!usermail || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

   // Check if user exists with the provided email
   const user = await User.findOne({ email: usermail});
   console.log('user', user);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email' });
  }
 
 
  // Compare the provided password with the hashed password stored in the database
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  if (currentPassword == newPassword) {
    return res.status(400).json({ message: 'New password must be different from the current password.' });
  }

  await updatePassword(user, newPassword);

  // Return a success response
  return res.json({ success: true, message: 'Password changed successfully' });
}

export async function forgotPassword (req: Request, res: Response,next: NextFunction){
  if(!req?.body?.email){
    res.status(500).json({error: 'No Email available'} );
  }

  try{
    // Check if user exists with the provided email
    const user = await User.findOne({ email: req?.body?.email});
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    
    const token = generateRandomString(32)
    const newToken = new Token ({
      userName: user.username,
      token
    });

    // Save the user to the database
    await newToken.save();
    const link = `${process.env.NODE_ENV === 'production'? process.env.UI_BASE_URL_PROD:process.env.UI_BASE_URL}/password-reset/${user.username}/${token}`;
    const mailOptions = {
      from: process.env.USER,
      to: req?.body?.email,
      subject: "Password Reset",
      html: `Click <a href="${link}">here</a> to reset your password.`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
      } else {
        console.log("Email sent: ", info.response);
        res.status(200).json({ message: 'Password reset email sent'});
      }
    });
  }catch(error){
    console.log('error', error);
    res.status(500).send('Internal Error occured');
  }
}

export async function resetPassword (req: Request, res: Response,next: NextFunction){
  const {username, token, newPassword} = req?.body;
  // Check if user exists with the provided email
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username' });
  }
  const userToken = await Token.findOne({userName: username});
  if(!userToken){
    return res.status(401).json({ message: 'Token Expired' });
  }
  if(userToken.token != token){
    return res.status(402).json({ message: 'Token Expired' });
  }

  await updatePassword(user, newPassword);
  return res.status(200).json({ success: true, message: 'Password reset successfully' });
  
}

const updatePassword = async (user: any, newPassword: string)=>{
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
 
  try {
    // Update the user's password in the database
    await User.updateOne({email:user.email}, { password: hashedPassword });
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

