
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
    parentLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        default: null,
      }
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
