import {Request, Response, NextFunction } from "express";
import Item from "../../models/item.model";
import Location from "../../models/location.model";




export async function insertItem(req:Request, res:Response, next: NextFunction){
    try {
        // Extract Item details from request body
        const { name, description } = req.body;
    
        // Create new item instance
        const newItem = new Item ({
            name,
            description
        });
    
        // Save the item to the database
        await newItem.save();
    
        // Respond with success message
        res.status(201).json({ message: 'Item Added successfully' });
      } catch (error) {
        // Handle errors
        console.error('Error Adding Item:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

export async function getItemsById(req:Request, res:Response, next: NextFunction){
    try{
        let itemId = req.params.itemId;
        if(!itemId){
            return res.status(401).json({ message: 'Something Went wrong!!' });
        }
        const item = await Item.findOne({ _id: itemId },{__v:0} );

        // console.log(transItem);
        res.status(200).json(item);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }    
}


export async function getItems(req:Request, res:Response, next: NextFunction){
    try{
        
        const itemList = await Item.find({  },{__v:0} );

        // console.log(transItem);
        res.status(200).json(itemList);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }    
}

export async function createLocation(req:Request, res:Response, next: NextFunction){
    try {
      // Extract Item details from request body
      const { name, description, parentLocationId } = req.body;

      // Create new Location instance
      const newLocation = new Location({
        name,
        description,
        parentLocationId
      });

      // Save the location to the database
      await newLocation.save();

      // Respond with success message
      res.status(201).json({ message: "Location Added successfully" });
    } catch (error) {
      // Handle errors
      console.error("Error Adding Location:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}
export async function getLocations(req:Request, res:Response, next: NextFunction){
    try{
        
        const locationList = await Location.find({  },{__v:0} );

        res.status(200).json(locationList);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }    
}