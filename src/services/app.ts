import  {Application} from 'express'
import bodyParser from "body-parser";
import {Request,Response,NextFunction} from "express";
import {adminRoute,vendorRoute} from '../routes';

export default async (app:Application)=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.get("/",(req:Request,res:Response)=>{
        res.status(200).json({
            msg:"get started"
        })
    })
    app.use('/admins',adminRoute);
    app.use('/vendors',vendorRoute);
    return app
}