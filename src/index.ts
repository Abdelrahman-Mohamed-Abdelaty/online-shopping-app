import express from 'express'
import mongoose from "mongoose";

import {Request,Response,NextFunction} from "express";
import {adminRoute,vendorRoute} from './routes';
const app=express();

import dotenv from 'dotenv';
import path from "node:path";


dotenv.config({ path: path.resolve(__dirname, '../config.env') });

mongoose
    .connect(process.env.MONGO_URI || 'error')
    .then(()=>console.log("connected to monogodb..."))
    .catch((err)=>console.log("error",err))

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"get started"
    })
})

app.use('/admins',adminRoute);
app.use('/vendors',vendorRoute);
const PORT=3001
const server=app.listen(PORT,()=>{
    console.log(`server run on port ${PORT}`)
});

export {server};