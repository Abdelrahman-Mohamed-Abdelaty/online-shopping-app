"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendor = exports.welcomeVendor = void 0;
const welcomeVendor = (req, res) => {
    res.status(200).json({
        msg: "hello vendor"
    });
};
exports.welcomeVendor = welcomeVendor;
const createVendor = (req, res, next) => {
    res.status(201).json({
        data: null,
        status: "success"
    });
};
exports.createVendor = createVendor;
