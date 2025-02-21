const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_DB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,}).then(() => {
                console.log('connected to mongoDB')
            })
    }   catch(err){
        console.error(`Err: ${err.message}`)
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