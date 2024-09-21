import {NextFunction, Request, Response} from "express";
import {IUser} from "../dto";
import { User, Product} from "../models";
import {generatePassword, generateSalt, catchAsync} from "../utility";
import {clearCookies} from "./auth.controller";
import {createFactory, deleteFactory, getAllFactory, getOneFactory, updateFactory} from "./handlerFactory";

export const extractUserData=async (req:Request)=>{
    const {name,lat,lon,
        pincode,address,
        phone,email,role
        }= <IUser>req.body;
    const salt = await generateSalt();
    const password = await generatePassword(req.body.password,salt);
    return {
        name,address,pincode,phone,email,password,
        lat,lon,salt,role
    }
}


export const createUser= catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    const extractedFields=await extractUserData(req);
    const createdUser = await User.create(extractedFields);
    createdUser.password = undefined;
    createdUser.salt = undefined;
    createdUser.refreshToken = undefined;
    res.status(201).json({
        data:createdUser,
        status:"success"
    })
})
// export const createUser = createFactory(User);
export const getMe = async (req:Request,res:Response,next:NextFunction)=>{
    req.params.id = req.user!.id.toString();
    next();
}
export const deleteMe=catchAsync(async (req,res,next)=>{
    await User.destroy(
        {
            where:{
                id:req.user!.id
            }
        }
    )
    clearCookies(res);
    res.status(204).json({
        status:"success",
        data:null
    })
})

export const deleteUser= deleteFactory(User);
export const updateUser = updateFactory(User);
export const getAllUsers= getAllFactory(User);
export const getUserById=getOneFactory(User);

export const getVendorById =  catchAsync (async (req:Request,res:Response,next:NextFunction)=>{
    const vendor = await User.findOne({
        where:{
            id:req.params.id,
            role:'vendor'
        },
        include:[Product],
        attributes:['name','address','phone','email','isAvailable','photo']
    })
    res.status(200).json({
        status:"success",
        vendor
    })
})
