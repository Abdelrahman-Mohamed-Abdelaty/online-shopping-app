import express from 'express'
import {Request,Response,NextFunction} from "express";

const app=express();

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"get started"
    })
})

const PORT=3000
const server=app.listen(PORT,()=>{
    console.log(`server run on port ${PORT}`)
});

export {server};