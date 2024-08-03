"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.vendorRoute = router;
router.get("/", controllers_1.welcomeVendor);
router.post('/', controllers_1.createVendor);
