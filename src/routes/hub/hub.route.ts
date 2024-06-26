import express, { Express, Request, Response , NextFunction} from "express";
import dotenv from "dotenv";
import { getItems, getItemsById, insertItem, createLocation, getLocations} from "../../controllers/hub/hub.controller";
dotenv.config();


const router = express.Router();

// Inserting new Item
// POST /home/items
router.post('/items', insertItem );


router.get('/items/', getItems);

// Getting Item details 
// GET /home/items/664f54356d1b1402c0ca2532
router.get('/items/:itemId', getItemsById);

// Editing an Item
// router.put('/items/:id', (req: Request, res: Response, next: NextFunction)=>{
    
    
// });


router.post('/locations', createLocation)
router.get('/locations', getLocations)
export default router;