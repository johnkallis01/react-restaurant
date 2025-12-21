import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
// eslint-disable-next-line no-undef
const SECRET_KEY=process.env.JWT_SECRET;
router.post('/register', async (req,res)=>{
    console.log('register')
    const {firstName, lastName, phone, email, password} = req.body;
    try{
        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message: 'user exisits'});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({firstName, lastName, email, phone, password: hashedPassword});
        res.status(201).json({_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone})
    }catch (error){
        res.status(500).json(error,{message: "user didn't register"})
    }
});
router.post('/login', async (req,res)=>{
    console.log("LOGIN ROUTER FUNC");
    // console.log(req.body)
    const {email, password} = req.body;
    // console.log(email)
    try{
        const user = await User.findOne({email});
        // console.log(user)
        if(!user) return res.status(400).json({message: 'login not found'});
        const isFound = await bcrypt.compare(password, user.password);
        // console.log(isFound)
        if(!isFound) return res.status(401).json({message: 'invalid passwords'});
        // {_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone})
        const token = jwt.sign({
            _id: user._id,
             name: user.lastName + ',' + user.firstName, 
             email: user.email, 
             phone: user.phone}, 
             SECRET_KEY, {expiresIn: '1h'});
        // console.log(token)
        res.status(202).json({token, user});
        // console.log(token)
        // return {token, user:{_id: user._id, name: user.lastName + ',' + user.firstName, email: user.email, phone: user.phone}};
    } catch (err){
        console.error('login error', err)
        res.status(500).json({message: 'err not found',error: err})
    }
});
router.post('/verify', async (req,res)=>{
    console.log("verify token FUNC");
    // console.log(req.headers.authorization)
    // console.log(req.body)
    let authHeader = req.headers.authorization;
    // console.log(authHeader)
    const token = authHeader.split(' ')[1];
    // console.log(token)
    if(!token){
        return { statusCode: 401, message: 'unauthorized, no token'}
    }
    try{
        const decoded = jwt.verify(token,SECRET_KEY);
        // console.log('decoded', decoded)
        res.json({
            verified: true,
            data: decoded
        });
    }catch(err){
        res.status(500).json({message: 'error token not verfied',error: err})
    }
    // try{
    //     const user = await User.findOne({email});
    //     // console.log(user)
    //     if(!user) return res.status(400).json({message: 'login not found'});
    //     const isFound = await bcrypt.compare(password, user.password);
    //     // console.log(isFound)
    //     if(!isFound) return res.status(401).json({message: 'invalid passwords'});
    //     // console.log('found')
    //     // console.log(SECRET_KEY)
    //     // {_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone})
    //     const token = jwt.sign({
    //         _id: user._id,
    //          name: user.lastName + ',' + user.firstName, 
    //          email: user.email, 
    //          phone: user.phone}, 
    //          SECRET_KEY, {expiresIn: '1h'});
    //     // console.log(token)
    //     res.status(202).json({token, user});
    //     // console.log(token)
    //     // return {token, user:{_id: user._id, name: user.lastName + ',' + user.firstName, email: user.email, phone: user.phone}};
    // } catch (err){
    //     console.error('login error', err)
    //     res.status(500).json({message: 'err not found',error: err})
    // }
});
export default router;