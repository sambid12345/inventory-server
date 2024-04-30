const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,  // token expires in 5 min
    },
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;