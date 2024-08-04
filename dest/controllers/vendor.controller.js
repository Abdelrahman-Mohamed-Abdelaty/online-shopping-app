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
exports.deleteVendor = exports.getVendorById = exports.getAllVendors = exports.createVendor = exports.welcomeVendor = void 0;
const models_1 = require("../models");
const welcomeVendor = (req, res) => {
    res.status(200).json({
        msg: "hello vendor"
    });
};
exports.welcomeVendor = welcomeVendor;
const extractFields = (req) => {
    const { name, ownerName, foodType, pincode, address, phone, email, password, coverImages, } = req.body;
    return {
        name, address, pincode, ownerName, foodType, phone, email, password, coverImages,
        salt: 'dd'
    };
};
const createVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const extractedFields = extractFields(req);
    const createdVendor = yield models_1.Vendor.create(extractedFields);
    res.status(201).json({
        data: createdVendor,
        status: "success"
    });
});
exports.createVendor = createVendor;
const getAllVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    res.status(200).json({
        data: vendors,
        status: "success"
    });
});
exports.getAllVendors = getAllVendors;
const getVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find({ _id: req.params.id });
    res.status(200).json({
        data: vendors,
        status: "success"
    });
});
exports.getVendorById = getVendorById;
const deleteVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        return res.status(400).json({ message: "please provide an id" });
    yield models_1.Vendor.deleteOne({ _id: req.params.id });
    res.status(204).json({
        data: null,
        status: "success"
    });
});
exports.deleteVendor = deleteVendor;
