import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export default async function handler(req, res){
    res.setHeader("Access-Control-Allow-Origin", "https://react-restaurant-virid-nine.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'login not found'});
        const isFound = await bcrypt.compare(password, user.password);
        if(!isFound) return res.status(401).json({message: 'invalid passwords'});
        // eslint-disable-next-line no-undef
        const SECRET_KEY=process.env.JWT_SECRET;
        const token = jwt.sign({
                    _id: user._id,
                    name: user.lastName + ',' + user.firstName, 
                    email: user.email, 
                    phone: user.phone}, 
                    SECRET_KEY, {expiresIn: '1h'});
        res.status(202).json({token, user});
    }catch (err){
        console.error('login error', err)
        res.status(500).json({message: 'err not found',error: err.message})
    }
}