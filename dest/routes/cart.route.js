"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.cartRoute = router;
router.use(controllers_1.protect);
router.use((0, controllers_1.restrictTo)('customer'));
// Cart Routes
router.post('/:id', controllers_1.isTheProductExist, controllers_1.isVendorAvailable, controllers_1.addProductToCart);
router.get('/', controllers_1.getCartOfCustomer);
router.delete('/:id?', controllers_1.deleteProductFromCart);
