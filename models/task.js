import mongoose from "mongoose";
import { User } from "./user.js";
import moment from "moment";

const task = mongoose.Schema({
    title: String,
    description: String,
    dueDate: String,
    priority: {
        type:Number,
        default: 3,
    },
    completed: {
        type: Boolean,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        validate: {
            validator: async function (value) {
                const user = await User.findOne({ _id: value });
                return !!user;
            },
            message: 'Invalid userId. User not found.',
        },
        required: [true, 'userId is required'],
    },
    createdAt: {
        type: String,
        default: () => moment().format(),
    },
    updatedAt: {
        type: String,
        default: ()=> moment().format(),
    },
});

export default mongoose.model('task',task);