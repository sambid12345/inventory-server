
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {type: String, required: true},
    quantity:{
        type: Number
    },
    serialNumber: String,
    modelNumber:String,
    imageId: String,
    archived:  Boolean,
    assetId:  String,
    createdAt : {
        type: Date,
        default: Date.now
    },
    insured: Boolean,
    lifetimeWarranty: Boolean,
    manufacturer : String,
    notes: String,
    purchaseFrom: String,
    purchasePrice: String,
    purchaseTime: Date,
    soldNotes: String,
    soldPrice: String,
    soldTime: Date,
    soldTo: String,
    warrantyDetails: String,
    warrantyExpires: Date,
    // location:{},
    // labels:{}
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
