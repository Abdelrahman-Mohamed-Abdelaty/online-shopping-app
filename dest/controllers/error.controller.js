"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const utility_1 = require("../utility");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new utility_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    var _a;
    const message = `Duplicate field value ${(_a = err.errors[0]) === null || _a === void 0 ? void 0 : _a.path}, Please enter another value`;
    return new utility_1.AppError(message, 400);
};
const handleJsonWebTokenError = () => {
    const message = `Invalid token,Please login again`;
    return new utility_1.AppError(message, 401);
};
const handleTokenExpiredError = () => {
    const message = `Tokes expired,Please login again`;
    return new utility_1.AppError(message, 401);
};
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            message: err.message,
            status: err.status,
            stack: err.stack,
            error: err
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                message: err.message,
                status: err.status,
            });
        }
        //programming errors
        console.error("Error 💣️💣️💣️", err);
        return res.status(500).json({
            message: "Something went wrong",
            status: "error",
        });
    }
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err);
        error.message = err.message;
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(err);
        }
        if (err.name === "JsonWebTokenError") {
            error = handleJsonWebTokenError();
        }
        if (err.name === "TokenExpiredError") {
            error = handleTokenExpiredError();
        }
        if (err.name === 'SequelizeUniqueConstraintError') {
            error = handleDuplicateFieldsDB(err);
        }
        sendErrorProd(error, req, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
