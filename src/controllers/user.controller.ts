import {NextFunction, Request, Response} from "express";
import {IUser} from "../dto";
import {Customer, User, Vendor, Admin, Delivery} from "../models";
import {generatePassword, generateSalt, catchAsync} from "../utility";
import {clearCookies} from "./auth.controller";

export const welcomeUser=async (req:Request,res:Response)=>{
    res.status(200).json({
        msg:"hello User"
    })

}
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
const getModelByRole = (role:string)=>{
    console.log(role)
    if(role === 'delivery') return Delivery;
    if(role === 'admin') return Admin;
    if(role === 'vendor') return Vendor;
    return Customer;
}

export const createUser= catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    const extractedFields=await extractUserData(req);
    const Model = getModelByRole(extractedFields.role)
    const createdUser = await Model.create(
        {
            user: extractedFields
        },
        {
            include: [
                {
                    association: Model.User
                }
            ],
        });
    createdUser.user.password = undefined;
    createdUser.user.salt = undefined;
    createdUser.user.refreshToken = undefined;
    res.status(201).json({
        data:createdUser,
        status:"success"
    })
})
export const getAllUsers=async (req:Request,res:Response,next:NextFunction)=>{
     const Users= await User.findAll({
     });
    res.status(200).json({
        data:Users,        status:"success"
    })
}
export const getUserById=catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    const user= await User.findByPk(req.params.id);
    user!.password = undefined;
    user!.salt = undefined;
    res.status(200).json({
        data:user,
        status:"success"
    })
})
export const getMe = async (req:Request,res:Response,next:NextFunction)=>{
    req.params.id = req.user!.id;
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
export const deleteUser=async (req:Request,res:Response,next:NextFunction)=>{
    if(!req.params.id) return res.status(400).json({message:"please provide an id"})
    await User.destroy({
        where:{
            id: req.params.id,
        }
    })
    res.status(204).json({
        data:null,
        status:"success"
    })
}