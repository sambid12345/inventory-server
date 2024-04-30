import express, { Express, Request, Response , NextFunction} from "express";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction)=>{
    console.log('running mode', process.env.NODE_ENV);
    res.json({data:"data"});
});

export default router;