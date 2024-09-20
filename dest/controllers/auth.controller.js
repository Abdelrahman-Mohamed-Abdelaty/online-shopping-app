"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.protect = exports.logout = exports.clearCookies = exports.login = exports.restrictTo = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const utility_1 = require("../utility");
const user_controller_1 = require("./user.controller");
const accessSecretKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
let cookiesOptions = {
    httpOnly: true,
    secure: false
};
if (process.env.NODE_ENV === 'production') {
    cookiesOptions.secure = true;
}
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ id: userId }, accessSecretKey, { expiresIn: '15m' });
}
function generateRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ id: userId, }, refreshSecretKey, { expiresIn: '7d' });
}
function decodeJwtToken(token, secretKey) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
}
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new utility_1.AppError("you don't have permission to perform this action", 403));
        next();
    };
};
exports.restrictTo = restrictTo;
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    user.password = undefined;
    user.salt = undefined;
    res.cookie('jwt', token, Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + 15 * 60 * 1000) }));
    res.cookie('refresh', refreshToken, Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }));
    res.status(statusCode).json({
        status: "success",
        token,
        user
    });
});
exports.login = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //check if email exists in database
    const user = yield models_1.User.findOne({ where: { email } });
    //check if password is correct
    if (!user || !(yield (0, utility_1.validatePassword)(password, user.password, user.salt))) {
        return next(new utility_1.AppError("email or password is not correct", 400));
    }
    yield sendToken(user, 200, res);
}));
const clearCookies = (res) => {
    res.cookie('jwt', 'logged-out', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refresh', 'logged-out', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
};
exports.clearCookies = clearCookies;
exports.logout = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.clearCookies)(res);
    res.status(200).json({
        status: "success",
    });
}));
const getTokens = (req) => {
    let token;
    let refresh;
    if (req.cookies.jwt)
        token = req.cookies.jwt;
    if (req.cookies.refresh)
        refresh = req.cookies.refresh;
    return [token, refresh];
};
const verifyTokens = (accessToken, refreshToken, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (refreshToken) {
        const decodedUserData = yield decodeJwtToken(refreshToken, refreshSecretKey);
        accessToken = generateAccessToken(decodedUserData.id);
        res.cookie('jwt', accessToken, Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + 15 * 60 * 1000) }));
        return decodedUserData;
    }
    if (accessToken)
        return yield decodeJwtToken(accessToken, accessSecretKey);
});
exports.protect = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let [accessToken, refreshToken] = getTokens(req);
    if (!accessToken && !refreshToken)
        return next(new utility_1.AppError("you are not logged, log in to get access", 401));
    const decodedUserData = yield verifyTokens(accessToken, refreshToken, res);
    //if user exists, it may be deleted and still have a valid token
    const user = yield models_1.User.findByPk(decodedUserData.id);
    if (!user)
        return next(new utility_1.AppError("User no longer exists", 401));
    //if user change password after creating the token
    if (user.isPasswordChangedRecent(decodedUserData.iat))
        return next(new utility_1.AppError("User recently change password,Please log in again", 401));
    req.user = user.dataValues;
    next();
}));
exports.signup = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    req.body.role = 'customer';
    if (req.body.password !== req.body.passwordConfirm)
        return next(new utility_1.AppError('password doesn\'t match passwordConfirm', 400));
    const userData = yield (0, user_controller_1.extractUserData)(req);
    const newUser = yield models_1.User.create(userData);
    yield sendToken(newUser.dataValues, 201, res);
}));
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
