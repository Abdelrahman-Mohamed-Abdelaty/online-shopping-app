import {AppError, catchAsync} from "../utility";
import {Cart, Product, Vendor} from "../models";

export const isTheProductExist= catchAsync(async (req,res,next)=>{
    const product = await Product.findByPk(req.params.id);
    if(!product)
        return next(new AppError('The product is not exist in our shop',404))
    req.params.vendorId = product.vendorId
    next();
})
export const isVendorAvailable=catchAsync(async (req,res,next)=>{

    const vendorId = parseInt(req.params.vendorId);
    const vendor = await Vendor.findByPk(vendorId);
    console.log(vendor)
    if(!vendor?.serviceAvailable)
        return next(new AppError('The vendor is not available now try again later',400))
    next();
})
export const addProductToCart = catchAsync(async (req,res,next)=>{
    // TODO: check any offers (later)
    await Cart.create({
        productId:req.params.id,
        customerId:req.user.id,
        units:req.query.units || 1,
    })
    const cart = await Cart.findAll({where:{customerId:req.user.id}})
    res.status(201).json({
        status:"success",cart
    })
})
