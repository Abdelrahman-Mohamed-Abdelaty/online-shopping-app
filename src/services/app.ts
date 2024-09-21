import express, {Application} from 'express'
import {
    productRoute,
    userRoute,
    cartRoute,
    vendorRoute,
    orderRoute,
    complaintRoute,
    notificationRoute
} from '../routes';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import {AppError} from "../utility";
import {globalErrorHandler} from "../controllers";
import path from "path";
const SQLiteStore = require('connect-sqlite3')(session);
import cors from 'cors';
import compression from 'compression';
// @ts-ignore
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import morgan from "morgan";


export default async (app:Application)=>{
    app.set('view engine','pug');
    app.set('views',path.join(__dirname,'views'));
    app.use(express.static(path.join(__dirname,'../../public')));
    //Implement CORS
    app.use(cors());
    app.options('*',cors());
    const limiter=rateLimit({
        max:100,
        windowMs:60*60*1000,
        message:'Too many requests from this IP,please try in an hour'
    })
    app.use(compression())
    app.use(xss());
    app.use('/api',limiter);
    app.use(cookieParser());
    app.use(express.json({limit:'10kb'}));// 10 kilo byte as max for denial attacks
    app.use(express.urlencoded({extended:true,limit:'10kb'}));// for sending requests from forms
    if(process.env.NODE_ENV==="development"){
        app.use(morgan("dev"))
    }
    app.use(logger('dev'))

    app.use('/api/v1/users',userRoute)
    app.use('/api/v1/products',productRoute)
    app.use('/api/v1/carts',cartRoute)
    app.use('/api/v1/orders',orderRoute)
    app.use('/api/v1/vendors',vendorRoute)
    app.use('/api/v1/complaints',complaintRoute)
    app.use('/api/v1/notifications',notificationRoute)
    app.all("*",(req,res,next)=>{
        const err=new AppError(`Can't find ${req.originalUrl} on this server`,404);
        next(err);
    });
    app.use(globalErrorHandler);
    return app
}