"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeAdmin = void 0;
const welcomeAdmin = (req, res) => {
    res.status(200).json({
        msg: "hello admin"
    });
};
exports.welcomeAdmin = welcomeAdmin;
