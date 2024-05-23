import express, { Express, Request, Response , NextFunction} from "express";
import dotenv from "dotenv";
import { getItems, insertItem } from "../../controllers/hub/hub.controller";
dotenv.config();


const router = express.Router();

// Inserting new Item
// POST /home/items
router.post('/items', insertItem );

// Getting Item details 
// GET /home/items/664f54356d1b1402c0ca2532
router.get('/items/:itemId', getItems);

// Editing an Item
// router.put('/items/:id', (req: Request, res: Response, next: NextFunction)=>{
    
    
// });

export default router;