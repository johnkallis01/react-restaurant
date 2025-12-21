import Menu from "../models/Menu.model.js";
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
// eslint-disable-next-line no-undef
const SECRET_KEY=process.env.JWT_SECRET;
const router = express.Router();
router.get('/', async (req,res)=>{
    console.log('GET MENUS');
    try{
        const menus = await Menu.find();
        res.json(menus)
    }catch(err){
        res.status(500).json({error: err.message,message: "menus not found"}) 
    }
});
router.put('/:id', async (req,res)=>{
    let authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    let isAdmin;
    if(!token){
        return new Error({ statusCode: 401, message: 'unauthorized, no token'})
    }
    try{
        const {email} = jwt.verify(token,SECRET_KEY);
        const user = await User.findOne({email});
        isAdmin = user.isAdmin;
    }catch(err){
        res.status(500).json({message: 'error token not verfied',error: err})
    }
    if(isAdmin){
        // console.log(typeof id)
        // console.log(req)
        const newMenu = req.body;
        const id = req.params.id;
        console.log(id, newMenu)
        try{
            const response = await Menu.findByIdAndUpdate(id, newMenu, {new: true});
            res.json({message: 'menu '+id+' has been updated',res: response})
        }catch(err){
            res.status(501).json({message: 'menu not updated',error: err})
        }
        
        // console.log(menu)
    }else{
        res.status(502).json({message: 'not authorized to update'})
    }
   
})
export default router;