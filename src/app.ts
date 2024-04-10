import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import UserRouter from "../routes/user/user.route"
import HubRouter from "../routes/hub/hub.route"
import userController from "../routes/user/user.controller";
const app: Express = express();

// HomeInventoryDB
app.use(express.json());
app.use(cors());


app.use("/", UserRouter);

app.use("/getData",userController.isAuntheticated, HubRouter);

// app.use("/",(req:Request, res: Response, cb: NextFunction)=>{
//     res.json({'msg': true})
// })


export default app;


// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// })
