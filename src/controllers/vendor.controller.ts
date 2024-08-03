import {NextFunction, Request, Response} from "express";

export const welcomeVendor=(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"hello vendor"
    })

}

export const createVendor=(req:Request,res:Response,next:NextFunction)=>{
    res.status(201).json({
        data:null,
        status:"success"
    })
}