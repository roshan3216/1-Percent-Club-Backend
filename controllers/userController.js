import jwt from 'jsonwebtoken';
import {User} from '../models/user.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) =>{
    const body = req.body;
    const {email, password}  = body;
    console.log(email, password, '[email and password]-[login]');
    try {
        const existingUser = await User.findOne({ email });
        console.log(existingUser, '[existingUser]');

        if(!existingUser){
            return res.status(404).json({ message: "User doesn't exist"});
        }
        
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        console.log(isPasswordCorrect, '[isPasswordCorrect]');

        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid Credentials"});
        }

        const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
        const accessToken = jwt.sign({email: existingUser.email, id: existingUser._id},accessTokenSecret,{expiresIn : "1h"});
        console.log(accessToken, '[accessToken]');

        const cookieOptions = {
            maxAge: 24*60*60*1000,
            httpOnly: true,
            secure: true,
        }
        const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

        const refreshToken = jwt.sign({email: email, id: existingUser._id},refreshTokenSecret,{expiresIn : "1d"});

        console.log(refreshToken,'[response]-[register]');

        res.cookie('refreshToken',refreshToken,cookieOptions);
        res.setHeader('Authorization', `${accessToken}`);
        

        return res.status(200).json({email: existingUser.email, name: existingUser.name, accessToken});

    } catch (error) {
        console.error(error, '[error in login]');
        return res.status(500).json("Something went wrong.");
    }

}

export const signUp = async (req, res) =>{
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const password = body.password;

    console.log(name, email, password, '[user , email and password]');
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,12);

        const user = new User({name, email,password: hashedPassword});

        const resp = await user.save();
        console.log(resp, '[resp]');
        
        const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
        const accessToken = jwt.sign({email: user.email, id: user._id},accessTokenSecret,{expiresIn : "1h"});
        console.log(accessToken, '[accessToken]');

        const cookieOptions = {
            maxAge: 24*60*60*1000,
            httpOnly: true,
            secure: true,
        }
        const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

        const refreshToken = jwt.sign({email: email, id: user._id},refreshTokenSecret,{expiresIn : "1d"});

        console.log(refreshToken,'[refreshToken]-[signup]');

        res.cookie('refreshToken',refreshToken,cookieOptions);
        res.setHeader('Authorization', `${accessToken}`);
        return res.status(200).json({email, name, accessToken});
    }catch (error){
        console.log(error, '[error in signup]');
        return res.status(500).json("Something went wrong.");
    }
}

export const logout = async (req, res ) =>{

    console.log('[logout success]-[logout]');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logout Successful' });
}

export const getHomePageData = async (req, res ) =>{

}
