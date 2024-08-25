import  {Application} from 'express'
import bodyParser from "body-parser";
import {Request,Response,NextFunction} from "express";
import {adminRoute, productRoute, userRoute} from '../routes';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import {AppError} from "../utility";
import {globalErrorHandler} from "../controllers";
const SQLiteStore = require('connect-sqlite3')(session);


export default async (app:Application)=>{
    //Middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(cookieParser());
    app.use(logger('dev'))
    app.use(session({
        secret:process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
    }));
    app.get("/",(req:Request,res:Response)=>{
        res.status(200).json({
            msg:"get started"
        })
    })
    app.use('/api/v1/admins',adminRoute);
    app.use('/api/v1/users',userRoute)
    app.use('/api/v1/products',productRoute)
    app.all("*",(req,res,next)=>{
        const err=new AppError(`Can't find ${req.originalUrl} on this server`,404);
        next(err);
    });
    app.use(globalErrorHandler);
    return app
}