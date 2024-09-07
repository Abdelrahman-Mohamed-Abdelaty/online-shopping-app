import {createFactory, deleteFactory, getAllFactory, getOneFactory, updateFactory} from "./handlerFactory";
import {Product, User} from "../models";
import {NextFunction,Request,Response} from "express";
import {AppError, catchAsync} from "../utility";
import sharp from "sharp";
import multer from 'multer'

const multerStorage=multer.memoryStorage();

export const deleteProduct= deleteFactory(Product);
export const updateProduct = updateFactory(Product);
export const getAllProducts= getAllFactory(Product);
export const getProductById=getOneFactory(Product);
export const createProduct=createFactory(Product);
export const setVendorId = (req:Request,res:Response,next:NextFunction)=>{
    req.body.vendorId = req.user!.id;
    console.log(req.body)
    next()
}
export const canChangeProduct =catchAsync (async (req:Request,res:Response,next:NextFunction)=>{
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if(product&&(product.dataValues.vendorId === req.user!.id || req.user!.role ==='admin'))
        return next();
    next(new AppError('you can only modify or delete your products',400))
})



const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        console.log("multer filter")
        console.log(file);
        cb(null,true);
    }else{
        cb(new AppError('Not an image! Please upload only images',400),false);
    }
}
const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter,
})
export const uploadProductPhotos=upload.fields([
    {name:'images',maxCount:2},
]);

export const resizeProductPhotos=async (req:Request,res:Response,next:NextFunction)=>{
    console.log("before error")
    if(!req.files.images || req.files.images.length!==2) {
        delete req.body.images
        return next();
    }
    //2) images
    console.log("Hello error")
    req.body.images=[]
    await Promise.all(
        req.files.images.map(async (img,i)=>{
            const filename=`product-${Date.now()}-${i+1}.jpeg`
            await sharp(img.buffer)
                .resize(1200,1200)
                .toFormat('jpeg')
                .jpeg({quality:90})
                .toFile(`public/img/products/${filename}`);
            req.body.images.push(filename);
        })
    )
    next();
}

export const validateImages = (req:Request,res:Response,next:NextFunction)=>{
    if(!req.body.images || req.body.images.length!==2){
        return next(new AppError('You must add 2 image only for this product',400));
    }
    next();
}