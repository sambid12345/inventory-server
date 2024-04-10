import { Request } from "express";
import User from "./user.model"

export interface UserRequest extends Request{
    user?: typeof User
}

