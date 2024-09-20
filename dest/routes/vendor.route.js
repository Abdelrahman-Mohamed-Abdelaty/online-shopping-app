"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.vendorRoute = router;
router.use(controllers_1.protect);
// Get all vendors
// router.get('/:id/products',getProductsOfVendor)
router.get('/orders', (0, controllers_1.restrictTo)('admin', 'vendor'), controllers_1.getVendorOrderItems);
router.get('/:id', controllers_1.getVendorById);
