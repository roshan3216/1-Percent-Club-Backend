import express from 'express';
import { getHomePageData, login, signUp,logout } from '../controllers/userController.js';
import authenticate from '../middleware/auth.js';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/logout',authenticate, logout);




router.post('/task',authenticate, createTask);
router.get('/task',authenticate, getTasks);
router.put('/task/:id',authenticate, updateTask);
router.delete('/task/:id', authenticate, deleteTask)
router.get('/home', authenticate , getHomePageData);

export default router;