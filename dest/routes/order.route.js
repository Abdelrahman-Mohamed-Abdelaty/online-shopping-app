"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.orderRoute = router;
router.use(controllers_1.protect);
router.get('/', (0, controllers_1.restrictTo)('admin'), controllers_1.getAllOrders);
// router.patch('/:id',restrictTo('admin','delivery'),updateOrder
//     ,handleConfirmedOrder,handleDeliveredOrder);
router.patch('/confirm-order/:id', (0, controllers_1.restrictTo)('admin'), controllers_1.confirmOrder);
router.patch('/delivery-order/:id', (0, controllers_1.restrictTo)('delivery'), controllers_1.isTheCorrectOrderDelivery, controllers_1.markOrderAsDelivered);
//should be for customers only
router.post('/', (0, controllers_1.restrictTo)('customer'), controllers_1.createOrder);
router.delete('/:id', (0, controllers_1.restrictTo)('customer'), controllers_1.deleteOrder);
router.get('/:id', (0, controllers_1.restrictTo)('customer', 'admin'), controllers_1.getOrderDetails);
router.patch('/:id', (0, controllers_1.restrictTo)('customer'), controllers_1.updateOrderLocation);
router.route('/:orderId/products/:productId')
    .patch((0, controllers_1.restrictTo)('customer'), controllers_1.updateProductFromOrder)
    .delete((0, controllers_1.restrictTo)('customer'), controllers_1.deleteProductFromOrder)
    .post((0, controllers_1.restrictTo)('customer'), controllers_1.addProductFromOrder);
