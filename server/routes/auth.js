import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req,res)=>{
    console.log('register')
    const {firstName, lastName, phone, email, password} = req.body;
    try{
        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message: 'user exisits'});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({firstName, lastName, email, phone, password: hashedPassword});
        res.status(201).json({_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, })
    }catch (error){
        res.status(500).json(error,{message: "user didn't register"})
    }
});
router.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'login not found'});
        const isFound = await bcrypt.compare(password, user.password);
        if(!isFound) return res.status(400).json({message: 'invalid password'});

        const token = jwt.sign({_id: user._id, name: user.lastName + ',' + user.firstName, email: user.email, phone: user.phone});
        res.json({token, user:{_id: user._id, name: user.lastName + ',' + user.firstName, email: user.email, phone: user.phone}});
    } catch (err){
        res.status(500).json(err,{message: 'err not found'})
    }
})
export default router;