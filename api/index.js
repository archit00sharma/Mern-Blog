import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database is connected")
}).catch((error)=>{
    console.log("error>>>>>>>>>>>>>>>>>>>>>.",error)
})
const app = express();

app.listen(3000, () => {
    console.log("server is running on port 3000`")
})