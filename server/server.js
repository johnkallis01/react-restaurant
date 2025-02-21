import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();
const connectDB = async () => {
    try{
        // eslint-disable-next-line no-undef
        await mongoose.connect(process.env.MONGO_DB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,}).then(() => {
                console.log('connected to mongoDB')
            })
    }   catch(err){
        console.error(`Err: ${err.message}`)
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
}
connectDB();
app.get('/', (req, res)=>{
    res.send("connected to server")
})
app.listen('5000', () => {
    console.log('server is running on port 5000')
})

app.use('/api/auth', authRoutes);