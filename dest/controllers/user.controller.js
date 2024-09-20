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
exports.getVendorById = exports.getUserById = exports.getAllUsers = exports.updateUser = exports.deleteUser = exports.deleteMe = exports.getMe = exports.createUser = exports.extractUserData = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const auth_controller_1 = require("./auth.controller");
const handlerFactory_1 = require("./handlerFactory");
const extractUserData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lat, lon, pincode, address, phone, email, role } = req.body;
    const salt = yield (0, utility_1.generateSalt)();
    const password = yield (0, utility_1.generatePassword)(req.body.password, salt);
    return {
        name, address, pincode, phone, email, password,
        lat, lon, salt, role
    };
});
exports.extractUserData = extractUserData;
exports.createUser = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const extractedFields = yield (0, exports.extractUserData)(req);
    const createdUser = yield models_1.User.create(extractedFields);
    createdUser.password = undefined;
    createdUser.salt = undefined;
    createdUser.refreshToken = undefined;
    res.status(201).json({
        data: createdUser,
        status: "success"
    });
}));
// export const createUser = createFactory(User);
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.params.id = req.user.id;
    next();
});
exports.getMe = getMe;
exports.deleteMe = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.User.destroy({
        where: {
            id: req.user.id
        }
    });
    (0, auth_controller_1.clearCookies)(res);
    res.status(204).json({
        status: "success",
        data: null
    });
}));
exports.deleteUser = (0, handlerFactory_1.deleteFactory)(models_1.User);
exports.updateUser = (0, handlerFactory_1.updateFactory)(models_1.User);
exports.getAllUsers = (0, handlerFactory_1.getAllFactory)(models_1.User);
exports.getUserById = (0, handlerFactory_1.getOneFactory)(models_1.User);
exports.getVendorById = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield models_1.User.findOne({
        where: {
            id: req.params.id,
            role: 'vendor'
        },
        include: [models_1.Product],
        attributes: ['name', 'address', 'phone', 'email', 'isAvailable', 'photo']
    });
    res.status(200).json({
        status: "success",
        vendor
    });
}));
