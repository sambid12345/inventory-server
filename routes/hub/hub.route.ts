import express, { Express, Request, Response , NextFunction} from "express";
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.json({data:"data"});
});

export default router;