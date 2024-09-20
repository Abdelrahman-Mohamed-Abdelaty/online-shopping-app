import {createFactory, deleteFactory, getAllFactory, getOneFactory, updateFactory} from "./handlerFactory";
import {Complaint} from "../models";
import {AppError, catchAsync} from "../utility";
import {Request,Response,NextFunction} from "express";

export const deleteComplaint= deleteFactory(Complaint);
export const updateComplaint = updateFactory(Complaint);
export const getAllComplaints= getAllFactory(Complaint);
export const createComplaint=createFactory(Complaint);

export const setCustomerId = (req:Request,res:Response,next:NextFunction)=>{
    req.query.customerId = req.user!.id;
    req.body.customerId = req.user!.id;
    next();
}
export const deleteStatusFromBody = (req:Request,res:Response,next:NextFunction)=> {
    delete req.body.status
    next();
}
export const canUpdateComplaint = catchAsync(async (req,res,next)=>{
    if(req.user!.role ==='admin'){
        req.body = {status:req.body.status}
        return next();
    }
    const complaint = await Complaint.findByPk(req.params.id).then(complaint=>complaint?.toJSON());
    if(!complaint || complaint.customerId !==req.user!.id)
        return next(new AppError('you dont\'t have such a complaint',404))
    req.body = {
        message:req.body.message,
        topic:req.body.topic,
    }
    next();
})
export const canDeleteComplaint = catchAsync(async (req,res,next)=>{
    const complaint = await Complaint.findByPk(req.params.id).then(complaint=>complaint?.toJSON());
    if(!complaint || complaint.customerId !==req.user!.id)
        return next(new AppError('you dont\'t have such a complaint',404))
    next();
})