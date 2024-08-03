"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
dotenv_1.default.config({ path: node_path_1.default.resolve(__dirname, '../.env') });
mongoose_1.default
    .connect(process.env.MONGO_URI || 'error')
    .then(() => console.log("connected to monogodb..."))
    .catch((err) => console.log("error", err));
app.get("/", (req, res) => {
    res.status(200).json({
        msg: "get started"
    });
});
app.use('/admins', routes_1.adminRoute);
app.use('/vendors', routes_1.vendorRoute);
const PORT = 3001;
const server = app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
});
exports.server = server;
