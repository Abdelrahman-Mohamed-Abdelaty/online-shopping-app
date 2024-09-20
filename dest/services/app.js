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
const express_1 = __importDefault(require("express"));
const routes_1 = require("../routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const utility_1 = require("../utility");
const controllers_1 = require("../controllers");
const path_1 = __importDefault(require("path"));
const SQLiteStore = require('connect-sqlite3')(express_session_1.default);
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
// @ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_2 = __importDefault(require("morgan"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.set('view engine', 'pug');
    app.set('views', path_1.default.join(__dirname, 'views'));
    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    //Implement CORS
    app.use((0, cors_1.default)());
    app.options('*', (0, cors_1.default)());
    const limiter = (0, express_rate_limit_1.default)({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests from this IP,please try in an hour'
    });
    app.use((0, compression_1.default)());
    app.use((0, xss_clean_1.default)());
    app.use('/api', limiter);
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json({ limit: '10kb' })); // 10 kilo byte as max for denial attacks
    app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' })); // for sending requests from forms
    if (process.env.NODE_ENV === "development") {
        app.use((0, morgan_2.default)("dev"));
    }
    app.use((0, morgan_1.default)('dev'));
    app.use('/api/v1/users', routes_1.userRoute);
    app.use('/api/v1/products', routes_1.productRoute);
    app.use('/api/v1/carts', routes_1.cartRoute);
    app.use('/api/v1/orders', routes_1.orderRoute);
    app.use('/api/v1/vendors', routes_1.vendorRoute);
    app.use('/api/v1/complaints', routes_1.complaintRoute);
    app.use('/api/v1/notifications', routes_1.notificationRoute);
    app.all("*", (req, res, next) => {
        const err = new utility_1.AppError(`Can't find ${req.originalUrl} on this server`, 404);
        next(err);
    });
    app.use(controllers_1.globalErrorHandler);
    return app;
});
