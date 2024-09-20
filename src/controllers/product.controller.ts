import {createFactory, deleteFactory, getAllFactory, getOneFactory, updateFactory} from "./handlerFactory";
import {Product, User} from "../models";
import {NextFunction,Request,Response} from "express";
import {AppError, catchAsync} from "../utility";
import sharp from "sharp";
import multer, { FileFilterCallback } from 'multer';
import {promises as fs} from "fs";
import {CustomRequest} from "../dto";
const multerStorage=multer.memoryStorage();
export const deleteProduct= deleteFactory(Product,true);
export const updateProduct = updateFactory(Product,true);
export const getAllProducts= getAllFactory(Product);
export const getProductById=getOneFactory(Product);
export const createProduct=createFactory(Product);
export const setVendorId = (req:Request,res:Response,next:NextFunction)=>{
    req.body.vendorId = req.user!.id;
    console.log(req.body)
    next()
}
export const canChangeProduct =catchAsync (async (req:any,res:Response,next:NextFunction)=>{
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if(product&&(product.dataValues.vendorId === req.user!.id || req.user!.role ==='admin')) {
        req.body.images = product?.dataValues.images
        req.rowFound = product;
        console.log(product.dataValues.images)
        return next();
    }
    next(new AppError('you can only modify or delete your products',400))
})



const multerFilter=(req:Request,file: Express.Multer.File,cb:FileFilterCallback)=>{
    if(file.mimetype.startsWith('image')){
        console.log("multer filter")
        console.log(file);
        cb(null,true);
    }else{
        cb(new AppError('Not an image! Please upload only images',400));
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
    const multerReq = req as CustomRequest
    if(!multerReq.files!.images || multerReq.files.images.length!==2) {
        delete req.body.images
        return next();
    }
    //2) imagesRequest
    multerReq.body.images=[]
    await Promise.all(
        multerReq.files.images.map(async (img,i)=>{
            const filename=`product-${Date.now()}-${i+1}.jpeg`
            await sharp(img.buffer)
                .resize(1200,1200)
                .toFormat('jpeg')
                .jpeg({quality:90})
                .toFile(`public/img/products/${filename}`);
            multerReq.body.images.push(filename);
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
export const deleteOldPhotoes = catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body.images)
    if(req.body.images){
        const promises= (req as CustomRequest).rowFound.dataValues.images.map((image:string)=>{
            return fs.unlink(`public/img/products/${image}`)
        })
        await Promise.all(promises);
    }
})