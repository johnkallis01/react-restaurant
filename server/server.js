import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './api/auth.js';
import menuRoutes from './api/menus.js';
const corsOptions = {
    origin: ["https://restaurant-server-umber.vercel.app"], credentials: true
}
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();
const connectDB = async () => {
    // console.log(process.env)
    try{
        // eslint-disable-next-line no-undef
        await mongoose.connect(process.env.MONGO_DB_URI).then(() => {
                console.log('connected to mongoDB')
            })
    }   catch(err){
        console.error(`Err: ${err.message}`)
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
}
connectDB();
// app.get('/', (req, res)=>{
//     res.send("connected to server")
// });



app.listen('5000', () => {
    console.log('server is running on port 5000')
});
app.use('/api/menus', menuRoutes);
app.use('/api/auth', authRoutes);
export default app;