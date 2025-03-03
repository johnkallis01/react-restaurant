import Menu from "../models/Menu.model.js";
import express from 'express';
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
export default router;