import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: { 
        type: String,
        required: true,
    },
    password: {
        type: String, 
        required: true,
    },
    createdAt: {
        type : Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
});


export const User = mongoose.model('user', userSchema);