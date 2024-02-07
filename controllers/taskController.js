import moment from "moment";
import Task from "../models/task.js";
import mongoose from "mongoose";



const isValidObjectId = (id) =>{
    const ObjectId = mongoose.Types.ObjectId;
    if(ObjectId.isValid(id)){
        if((String(new ObjectId(id))) === id)
            return true;
        return false;
    }
    return false;
}

export const getTasks = async (req, res ) =>{

    const userId = req.userId;
    console.log(userId, '[id]-[getTasks]');

    try {
        const tasks = await Task.find({userId: userId});
        console.log(tasks, '[tasks]-[getTasks]');

        return res.status(200).json(tasks);
        
    } catch (err) {
        console.log(err,'[erorr in getTasks]');
        return res.status(500).json('Something went wrong');
    }

}

export const createTask = async ( req, res ) =>{

    const body = req.body;
    const {title,description,dueDate, priority, completed} = body;
    const userId = String(req.userId);
    
    console.log({title,description, dueDate, priority,completed, userId}, '[createTask]-[req.body]');
    try {
        const dt = moment(dueDate,'YYYY-MM-DD').format('YYYY-MM-DD');
        const task = new Task({title,description,dueDate: dt,priority,completed, userId});
        console.log(task, '[task]-[createTask]');
        const resp = await task.save();
        console.log(resp, '[resp]');
        
        return res.status(200).json(resp);
    } catch (err) {
        console.log(err, '[error in createTask]');

        return res.status(500).json('Something went wrong');
    }


}

export const updateTask = async (req, res ) =>{

    const body = req.body;

    const taskId = req.params.id;
    console.log(taskId, '[taskId]');
    if(!isValidObjectId(taskId)){
        return res.status(400).json('Invalid task');
    }
    const userId = String(req.userId);
    const {title,description,dueDate, priority, completed} = body;

    console.log({taskId, userId, title,description,dueDate,priority, completed}, '[body]-[updateTask]');

    try {
        const resp = await Task.findByIdAndUpdate(taskId, {
            title,
            description,
            dueDate,
            priority,
            completed,
            userId,
        },{new: true});

        console.log(resp , '[resp]-[updateTask]');
        return res.status(200).json(resp);
    } catch (err) {
        console.log(err, '[error in updateTask]');
        return res.status(500).json('Something went wrong');
        
    }

}

export const deleteTask = async (req, res) =>{

    const taskId = req.params.id;
    console.log(taskId, '[taskId]-[deletetask]');
    if(!isValidObjectId(taskId)){
        return res.status(400).json('Invalid task');
    }


    try {
        const resp = await Task.findByIdAndDelete({_id: taskId});
        console.log(resp, '[resp]-[deleteTask]')

        return res.status(200).json({'message' : `Task ${taskId} deleted successfully`});

    } catch (err) {
        console.log(err, '[error in deleteTask]');
        return res.status(500).json('Something went wrong');
    }

}
