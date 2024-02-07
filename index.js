import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import apiRoutes from './routes/route.js';

dotenv.config();
const app = express();

const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:4000',
    'https://breathe-esg-web.vercel.app',
    'https://breathe-esg-web.vercel.app/',
    'https://breathe-esg.netlify.app/',
    'https://1-percent-club.vercel.app/',
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: 'Authorization',
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api',apiRoutes);

app.use('/',async (req, res) =>{
    res.status(200).json('1% Club API working');
});



const CONNECTION_URL= process.env.CONNECTION_URL;
const PORT = process.env.PORT || 7000;

mongoose.connect(CONNECTION_URL)
    .then( ()=>{
        console.log('Connected to mongodb');
        app.listen(PORT, ()=> console.log(`SERVER RUNNING ON PORT : ${PORT}`))
    })
    .catch( (error)=> console.log(error));