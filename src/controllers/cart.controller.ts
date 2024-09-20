import {AppError, catchAsync} from "../utility";
import {Cart, Product, User} from "../models";
import {Response,Request,NextFunction} from "express";
import {ProductFilterObject} from "../dto";

export const isTheProductExist= catchAsync(async (req,res,next)=>{
    const product = await Product.findByPk(req.params.id);
    if(!product)
        return next(new AppError('The product is not exist in our shop',404))
    req.params.vendorId = product.vendorId.toString()
    next();
})
export const isVendorAvailable=catchAsync(async (req,res,next)=>{
    const vendorId = parseInt(req.params.vendorId);
    console.log("vendorId",vendorId)
    const vendor = await User.findOne({
        where:{
            id:vendorId,role:'vendor'
        }
    }) as User;
    if(!vendor.isAvailable)
        return next(new AppError('The vendor is not available now try again later',400))
    next();
})
const getAllCartItems = async(status:number,customerId:number,res:Response)=>{
    const cart = await Cart.findAll({where:{customerId}})
    res.status(status).json({
        status:"success",cart
    })
}

export const addProductToCart = catchAsync(async (req:Request,res,next)=>{
    await Cart.create({
        productId:req.params.id,
        customerId:req.user!.id,
        units:req.query.units || 1,
    })
    await getAllCartItems(201,req.user.id*1,res)
})

export const getCartOfCustomer = catchAsync(async (req,res,next)=>{
    await getAllCartItems(200,req.user.id*1,res)
})

export const deleteProductFromCart = catchAsync(async (req,res,next)=>{
    const productFilterObject = {customerId:req.user.id} as ProductFilterObject
    if(req.params.id)
        productFilterObject.productId= parseInt(req.params.id);
    await Cart.destroy({
        where: {...productFilterObject}
    })
    await getAllCartItems(200,req.user.id*1,res)
})
