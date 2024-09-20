import {NextFunction,Response,Request} from "express";
import jwt from 'jsonwebtoken';
import {User} from "../models";
import {AppError, catchAsync, validatePassword} from "../utility";
import {extractUserData} from "./user.controller";

const accessSecretKey = process.env.SECRET_KEY as string
const refreshSecretKey = process.env.REFRESH_SECRET_KEY as string
let cookiesOptions={
    httpOnly:true,
    secure: false
}
if(process.env.NODE_ENV==='production'){
    cookiesOptions.secure=true;
}
function generateAccessToken(userId:number) {
    return jwt.sign({ id: userId }, accessSecretKey , { expiresIn: '15m' });
}

function generateRefreshToken(userId:number) {
    return jwt.sign({ id: userId,}, refreshSecretKey, { expiresIn: '7d' });
}
function decodeJwtToken(token:string, secretKey:string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
}
export const restrictTo=(...roles: string[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        if(!roles.includes(req.user!.role) )
            return next(new AppError("you don't have permission to perform this action",403));
        next();
    }
}
interface JwtUserData{
    id:number;
    iat:number;
}

const sendToken=async (user:User,statusCode:number,res:Response)=>{
    const token = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id)
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

const getTokens = (req:Request)=>{
    let token:string | undefined;
    let refresh:string | undefined;
    if(req.cookies.jwt)
        token=req.cookies.jwt;
    if(req.cookies.refresh)
        refresh = req.cookies.refresh;
    return [token,refresh]
}
const verifyTokens = async (accessToken:string | undefined,
                            refreshToken:string|undefined,res:Response):Promise<JwtUserData|undefined>=>{
    if(refreshToken){
        const decodedUserData=await decodeJwtToken(refreshToken,refreshSecretKey) as JwtUserData;
        accessToken = generateAccessToken(decodedUserData.id)
        res.cookie('jwt',accessToken, {...cookiesOptions,expires:new Date(Date.now()+ 15 * 60 * 1000),})
        return decodedUserData;
    }
    if(accessToken)
        return await decodeJwtToken(accessToken,accessSecretKey) as JwtUserData;
}

export const protect=catchAsync(async (req,res,next)=>{
    let [accessToken,refreshToken] = getTokens(req);
    if(!accessToken&&!refreshToken)
        return next(new AppError("you are not logged, log in to get access",401))
    const decodedUserData = await verifyTokens(accessToken,refreshToken,res)  as JwtUserData
    //if user exists, it may be deleted and still have a valid token
    const user=await User.findByPk(decodedUserData.id);
    if(!user)
        return next(new AppError("User no longer exists",401))
    //if user change password after creating the token
    if(user.isPasswordChangedRecent(decodedUserData.iat))
        return next(new AppError("User recently change password,Please log in again",401))
    req.user=user.dataValues;
    next();
})

export const signup=catchAsync(async(req,res,next)=>{
    console.log(req.body)
    req.body.role = 'customer';
    if(req.body.password !== req.body.passwordConfirm)
        return next(new AppError('password doesn\'t match passwordConfirm',400));
    const userData = await extractUserData(req);
    const newUser=await User.create(userData);
    await sendToken(newUser.dataValues,201,res);
})


// export const ensureAuthenticated=(req:Request, res:Response, next:NextFunction)=> {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.status(401).redirect('/'); // Redirect to login page if not authenticated
// }
// export const logoutGoogle=(req:Request, res:Response, next:NextFunction)=>{
//     req.logout(function(err) {
//         if (err) { return next(err); }
//         res.redirect('/');
//     });
// }