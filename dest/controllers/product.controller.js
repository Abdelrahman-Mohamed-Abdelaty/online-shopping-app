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
exports.deleteOldPhotoes = exports.validateImages = exports.resizeProductPhotos = exports.uploadProductPhotos = exports.canChangeProduct = exports.setVendorId = exports.createProduct = exports.getProductById = exports.getAllProducts = exports.updateProduct = exports.deleteProduct = void 0;
const handlerFactory_1 = require("./handlerFactory");
const models_1 = require("../models");
const utility_1 = require("../utility");
const sharp_1 = __importDefault(require("sharp"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const multerStorage = multer_1.default.memoryStorage();
exports.deleteProduct = (0, handlerFactory_1.deleteFactory)(models_1.Product, true);
exports.updateProduct = (0, handlerFactory_1.updateFactory)(models_1.Product, true);
exports.getAllProducts = (0, handlerFactory_1.getAllFactory)(models_1.Product);
exports.getProductById = (0, handlerFactory_1.getOneFactory)(models_1.Product);
exports.createProduct = (0, handlerFactory_1.createFactory)(models_1.Product);
const setVendorId = (req, res, next) => {
    req.body.vendorId = req.user.id;
    console.log(req.body);
    next();
};
exports.setVendorId = setVendorId;
exports.canChangeProduct = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const product = yield models_1.Product.findByPk(productId);
    if (product && (product.dataValues.vendorId === req.user.id || req.user.role === 'admin')) {
        req.body.images = product === null || product === void 0 ? void 0 : product.dataValues.images;
        req.rowFound = product;
        console.log(product.dataValues.images);
        return next();
    }
    next(new utility_1.AppError('you can only modify or delete your products', 400));
}));
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        console.log("multer filter");
        console.log(file);
        cb(null, true);
    }
    else {
        cb(new utility_1.AppError('Not an image! Please upload only images', 400));
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.uploadProductPhotos = upload.fields([
    { name: 'images', maxCount: 2 },
]);
const resizeProductPhotos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const multerReq = req;
    if (!multerReq.files.images || multerReq.files.images.length !== 2) {
        delete req.body.images;
        return next();
    }
    //2) imagesRequest
    multerReq.body.images = [];
    yield Promise.all(multerReq.files.images.map((img, i) => __awaiter(void 0, void 0, void 0, function* () {
        const filename = `product-${Date.now()}-${i + 1}.jpeg`;
        yield (0, sharp_1.default)(img.buffer)
            .resize(1200, 1200)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/products/${filename}`);
        multerReq.body.images.push(filename);
    })));
    next();
});
exports.resizeProductPhotos = resizeProductPhotos;
const validateImages = (req, res, next) => {
    if (!req.body.images || req.body.images.length !== 2) {
        return next(new utility_1.AppError('You must add 2 image only for this product', 400));
    }
    next();
};
exports.validateImages = validateImages;
exports.deleteOldPhotoes = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.images);
    if (req.body.images) {
        const promises = req.rowFound.dataValues.images.map((image) => {
            return fs_1.promises.unlink(`public/img/products/${image}`);
        });
        yield Promise.all(promises);
    }
}));
