
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    parentLocationId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        default: null,
    }
}, { versionKey: false });

const Location = mongoose.model('Location', locationSchema);

export default Location;
