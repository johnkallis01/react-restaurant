import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
const corsOptions = {
    origin: ["http://localhost:5173"]
}
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
});
// app.use((req, res, next) => {
//     console.log('Received Request:', req.method, req.url);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });
app.listen('8080', () => {
    console.log('server is running on port 8080')
});

app.use('/api/auth', authRoutes);