import User from '../../models/user.model'
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt"
import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRequest } from "../../models/Request.model";


const generateRandomString = (length: number) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Return required number of characters
};

let JWT_SECRET : string

interface DecodedToken extends JwtPayload {
  userId: string;
}

const userSignUp = async (req : UserRequest, res : Response) => {
    console.log('inside signup');
    console.log('body', req.body);
    
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

const userLogin = async (req: UserRequest, res : Response, next : NextFunction)=>{
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

        // const JWT_SECRET = generateRandomString(32);
        JWT_SECRET = generateRandomString(32);

        // Generate JWT token for authentication
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with success message
        res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


const isAuntheticated = async (req: UserRequest, res: Response, next: NextFunction)=>{
  try {
    // Extract JWT token from request headers
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    console.log('decoded', decoded);

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
    console.error('Error verifying JWT token:', error);
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
}


export default {userSignUp, userLogin, isAuntheticated};