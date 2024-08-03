import {Request, Response} from "express";

export const welcomeAdmin=(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"hello admin"
    })

}

