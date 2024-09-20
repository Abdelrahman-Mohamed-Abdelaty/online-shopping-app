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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductFromCart = exports.getCartOfCustomer = exports.addProductToCart = exports.isVendorAvailable = exports.isTheProductExist = void 0;
const utility_1 = require("../utility");
const models_1 = require("../models");
exports.isTheProductExist = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield models_1.Product.findByPk(req.params.id);
    if (!product)
        return next(new utility_1.AppError('The product is not exist in our shop', 404));
    req.params.vendorId = product.vendorId.toString();
    next();
}));
exports.isVendorAvailable = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = parseInt(req.params.vendorId);
    console.log("vendorId", vendorId);
    const vendor = yield models_1.User.findOne({
        where: {
            id: vendorId, role: 'vendor'
        }
    });
    if (!vendor.isAvailable)
        return next(new utility_1.AppError('The vendor is not available now try again later', 400));
    next();
}));
const getAllCartItems = (status, customerId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield models_1.Cart.findAll({ where: { customerId } });
    res.status(status).json({
        status: "success", cart
    });
});
exports.addProductToCart = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Cart.create({
        productId: req.params.id,
        customerId: req.user.id,
        units: req.query.units || 1,
    });
    yield getAllCartItems(201, req.user.id * 1, res);
}));
exports.getCartOfCustomer = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield getAllCartItems(200, req.user.id * 1, res);
}));
exports.deleteProductFromCart = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productFilterObject = { customerId: req.user.id };
    if (req.params.id)
        productFilterObject.productId = parseInt(req.params.id);
    yield models_1.Cart.destroy({
        where: Object.assign({}, productFilterObject)
    });
    yield getAllCartItems(200, req.user.id * 1, res);
}));
