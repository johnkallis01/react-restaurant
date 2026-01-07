import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authVerify from './api/auth/verify.js';
import authLogin from './api/auth/login.js';
import menuRoutes from './api/menus.js';
import cookieParser from "cookie-parser";
const allowedOrigins = [
  "https://react-restaurant-virid-nine.vercel.app",
  "http://localhost:5173",
];
const corsOptions = {
  origin: [
    "https://react-restaurant-virid-nine.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
};
const app = express();
app.use(cors({
    origin: (origin, callback)=> {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        } else {
            callback(new Error("cors not allowed"));
        }
    }, credentials: true,
}));
// app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
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
// app.use('/api/auth', authRoutes);
// app.post('/api/auth/verify', authVerify);
// app.post('/api/auth/login', authLogin);
export default app;