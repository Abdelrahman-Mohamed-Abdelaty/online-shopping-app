"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.status(200).json({
        msg: "get started"
    });
});
app.use('/admins', routes_1.adminRoute);
app.use('/vendors', routes_1.vendorRoute);
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
});
exports.server = server;
