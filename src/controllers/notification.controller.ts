import {createFactory, deleteFactory, getAllFactory, getOneFactory, updateFactory} from "./handlerFactory";
import {Notification} from "../models";
import {AppError, catchAsync} from "../utility";
import {Request,Response,NextFunction} from "express";

export const deleteNotificationById= deleteFactory(Notification);
export const getMyNotification= getAllFactory(Notification,true);
export const updateNoticationsSeen = catchAsync(async (req,res)=>{
    await Notification.update({seen:true},{
        where:{
            to:req.user!.id,
            seen:false
        }
    })
})
export const deleteMyNotification = catchAsync(async (req,res,next)=>{
    await Notification.destroy({
        where:{
            to:req.user!.id
        }
    })
    res.status(204).json({
        status:"success",
        data:null,
    })
})

export const setRecepiantId = (req:Request,res:Response,next:NextFunction)=>{
    req.query.to = req.user!.id.toString();
    next();
}

export const canDeleteNotification = catchAsync(async (req,res,next)=>{
    const notification = await Notification.findByPk(req.params.id).then(obj=>obj?.toJSON());
    if(!notification || notification.to !==req.user!.id)
        return next(new AppError('you dont\'t have such a notification',404))
    next();
})