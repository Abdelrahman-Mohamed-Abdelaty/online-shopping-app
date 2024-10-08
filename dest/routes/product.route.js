"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.productRoute = router;
router.get('/', controllers_1.getAllProducts);
router.get('/:id', controllers_1.getProductById);
router.use(controllers_1.protect);
router.use((0, controllers_1.restrictTo)('vendor', 'admin'));
router.post('/', controllers_1.uploadProductPhotos, controllers_1.resizeProductPhotos, controllers_1.validateImages, controllers_1.setVendorId, controllers_1.createProduct);
router.patch('/:id', controllers_1.canChangeProduct, controllers_1.uploadProductPhotos, controllers_1.resizeProductPhotos, controllers_1.updateProduct, controllers_1.deleteOldPhotoes);
router.delete('/:id', controllers_1.canChangeProduct, controllers_1.deleteProduct, controllers_1.deleteOldPhotoes);
