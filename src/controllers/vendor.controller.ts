import {NextFunction, Request, Response} from "express";
import {CreateVendorInput} from "../dto";
import {Vendor} from "../models";

export const welcomeVendor=(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"hello vendor"
    })

}
const extractFields=(req:Request)=>{
    const {name,ownerName,foodType,
        pincode,address,
        phone,email,
        password,coverImages,}= <CreateVendorInput>req.body;
    return {
        name,address,pincode,ownerName,foodType,phone,email,password,coverImages,
        salt:'dd'
    }
}
export const createVendor=async (req:Request,res:Response,next:NextFunction)=>{
    const extractedFields=extractFields(req);
    const createdVendor= await Vendor.create(extractedFields)
    res.status(201).json({
        data:createdVendor,
        status:"success"
    })
}
export const getAllVendors=async (req:Request,res:Response,next:NextFunction)=>{
     const vendors= await Vendor.find();
    res.status(200).json({
        data:vendors,
        status:"success"
    })
}
export const getVendorById=async (req:Request,res:Response,next:NextFunction)=>{
    const vendors= await Vendor.find({_id:req.params.id});
    res.status(200).json({
        data:vendors,
        status:"success"
    })
}
export const deleteVendor=async (req:Request,res:Response,next:NextFunction)=>{
    if(!req.params.id) return res.status(400).json({message:"please provide an id"})
    await Vendor.deleteOne({_id:req.params.id});
    res.status(204).json({
        data:null,
        status:"success"
    })
}