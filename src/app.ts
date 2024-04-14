import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import UserRouter from "./routes/user/user.route"
import HubRouter from "./routes/hub/hub.route"
import userController from "./controllers/user/user.controller";
const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/users", UserRouter);

app.use("/home",userController.isAuntheticated, HubRouter);

export default app;