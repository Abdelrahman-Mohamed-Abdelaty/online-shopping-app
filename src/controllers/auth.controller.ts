import {NextFunction,Response,Request} from "express";
import {IUser} from "../dto";
// @ts-ignore
import jwt from 'jsonwebtoken';
import {Customer, User} from "../models";
import {AppError, catchAsync, validatePassword} from "../utility";
import {use} from "passport";
import {promisify} from "node:util";
import {extractUserData} from "./user.controller";

export const ensureAuthenticated=(req:Request, res:Response, next:NextFunction)=> {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).redirect('/'); // Redirect to login page if not authenticated
}
export const logoutGoogle=(req:Request, res:Response, next:NextFunction)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

const secretKey = process.env.SECRET_KEY
const refreshSecretKey = process.env.REFRESH_SECRET_KEY

function generateAccessToken(user:User) {
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '15m' });
}

function generateRefreshToken(user:User) {
    return jwt.sign({ id: user.id,}, refreshSecretKey, { expiresIn: '7d' });
}
export const restrictTo=(...roles: (string | any[])[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        if(!roles.includes(req.user!.role) )
            return next(new AppError("you don't have permission to perform this action",403));
        next();
    }
}
let cookiesOptions={
    httpOnly:true,
    secure: false
}
if(process.env.NODE_ENV==='production'){
    cookiesOptions.secure=true;
}
const sendToken=async (user:User,statusCode:number,res:Response)=>{
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user)
    user.password=undefined;
    user.salt=undefined;
    res.cookie('jwt',token, {...cookiesOptions,expires:new Date(Date.now()+ 15 * 60 * 1000)})
    res.cookie('refresh',refreshToken,{...cookiesOptions,expires:new Date(Date.now()+ 7 * 24 * 60 * 60 * 1000),})
    res.status(statusCode).json({
        status:"success",
        token,
        user
    })
}

export const login=catchAsync(async (req,res,next)=>{
    const {email,password}=req.body;
    //check if email exists in database
    const user = await User.findOne({where:{email}});
    //check if password is correct
    if(!user||!await validatePassword(password,user.password!,user.salt!)){
        return next(new AppError("email or password is not correct",400))
    }
    console.log(user)
    await sendToken(user,200,res);
})
export const clearCookies = (res:Response)=>{
    res.cookie('jwt','logged-out',{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    res.cookie('refresh','logged-out',{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
}
export const logout=catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    clearCookies(res);
    res.status(200).json({
        status:"success",
    })
})

export const protect=catchAsync(async (req,res,next)=>{
    //get the token
    let token;
    let refresh;
    if(req.cookies.jwt)
        token=req.cookies.jwt;
    if(req.cookies.refresh)
        refresh = req.cookies.refresh;

    if(!token&&!refresh){
        return next(new AppError("you are not logged in,log in to get access",401))
    }
    //verify the token
    let decoded;
    try{
        decoded=await promisify(jwt.verify)(token,secretKey);     //throw error if invalid signature else return payload
    }catch (err){
        const refreshToken = req.cookies.refresh;
        decoded=await promisify(jwt.verify)(refreshToken,refreshSecretKey);
        token = generateAccessToken(decoded);
        res.cookie('jwt',token, {...cookiesOptions,expires:new Date(Date.now()+ 15 * 60 * 1000),})
    }
    //if user exists, it may be delete and still have a valid token
    const user=await User.findByPk(decoded.id);
    if(!user){
        return next(new AppError("User no longer exists",401))
    }
    //if user change password after creating the token
    if(user.passwordChangedAt&&(user.passwordChangedAt>new Date(decoded.iat*1000))){
        return next(new AppError("User recently change password,Please log in again",401))
    }
    req.user=user.dataValues;
    res.locals.user=user;
    next();
})

export const signup=catchAsync(async(req,res,next)=>{
    req.body.role = 'customer';
    const userData = await extractUserData(req)
    console.log(userData)
    if(req.body.password !== req.body.passwordConfirm)
        return next(new AppError('password doesn\'t match passwordConfirm',400));
    const newUser=await Customer.create({user:userData},
        {
            include: [
                {
                    association: Customer.User
                }
            ],
        });
    console.log(newUser.dataValues.user.dataValues)
    await sendToken(newUser.dataValues.user.dataValues,201,res);
})
