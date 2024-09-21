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
exports.updateOrderLocation = exports.isTheCorrectOrderDelivery = exports.markOrderAsDelivered = exports.confirmOrder = exports.sendNotifcation = exports.getVendorOrderItems = exports.addProductFromOrder = exports.updateProductFromOrder = exports.deleteProductFromOrder = exports.getOrderDetails = exports.createOrder = exports.deleteOrder = exports.getAllOrders = void 0;
const order_model_1 = require("../models/order.model");
const handlerFactory_1 = require("./handlerFactory");
const utility_1 = require("../utility");
const sequelize_1 = require("../utility/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../models");
exports.getAllOrders = (0, handlerFactory_1.getAllFactory)(order_model_1.Order);
exports.deleteOrder = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield order_model_1.Order.destroy({
        where: { id: req.params.id, customerId: req.user.id }
    });
    if (!count) {
        return next(new utility_1.AppError("you don't have such an order", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
const getUserCartItems = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield sequelize_1.sequelize.query(`
        SELECT price,units,"productId"
        FROM products as p
        JOIN carts as c
        ON p.id = c."productId"
        WHERE c."customerId" = $1
        `, {
        bind: [userId],
        type: sequelize_2.QueryTypes.SELECT,
    });
});
const calcTotalPrice = (items) => {
    let totalPrice = 0;
    items.forEach((item) => {
        totalPrice += item.price * item.units;
    });
    return totalPrice;
};
exports.createOrder = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.customerId = req.user.id;
    const result = yield getUserCartItems(req.user.id);
    if (result.length < 1)
        return next(new utility_1.AppError('your cart is empty,please add some product to the cart', 400));
    const totalPrice = calcTotalPrice(result);
    // Create order
    req.body.lat = req.body.lat || req.user.lat;
    req.body.lon = req.body.lon || req.user.lon;
    const order = yield order_model_1.Order.create(req.body);
    order.dataValues.totalPrice = totalPrice;
    // Add orderId to result array elements
    result.forEach((item) => {
        item.orderId = order.dataValues.id;
    });
    // Fill order items
    yield order_model_1.OrderItem.bulkCreate(result, { validate: true });
    // delete the cart of the user
    yield models_1.Cart.destroy({
        where: {
            customerId: req.user.id
        }
    });
    res.status(201).json({
        status: "success",
        data: {
            order: Object.assign(Object.assign({}, order.dataValues), { totalPrice })
        }
    });
}));
exports.getOrderDetails = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    let order = yield order_model_1.Order.findByPk(orderId, {
        include: {
            model: models_1.Product,
            attributes: ['id', 'name', 'vendorId', 'images',],
            through: {
                model: order_model_1.OrderItem,
                attributes: ['units', 'price'],
            }
        }
    }).then(order => order === null || order === void 0 ? void 0 : order.toJSON());
    if (order && req.user.id != order.customerId && req.user.role !== 'admin')
        order = null;
    if (order) {
        order.products.forEach((product) => {
            product.units = product.orderItems.units;
            product.price = product.orderItems.price;
            delete product.orderItems;
        });
    }
    else
        return next(new utility_1.AppError('order not found', 404));
    res.status(200).json({
        status: "success",
        order
    });
}));
exports.deleteProductFromOrder = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, orderId } = req.params;
    const order = yield order_model_1.Order.findByPk(orderId).then(order => order === null || order === void 0 ? void 0 : order.toJSON());
    if (!order || order.customerId != req.user.id)
        return next(new utility_1.AppError('order not found', 404));
    if (order.status === 'Delivered' ||
        order.status === 'Out for Delivery' ||
        order.status === 'Canceled')
        return next(new utility_1.AppError('you can\'t modify this order now order', 400));
    const item = yield order_model_1.OrderItem.destroy({
        where: {
            productId,
            orderId
        }
    });
    if (!item)
        return next(new utility_1.AppError('no such an item in the order', 404));
    //delete the order if no items in it after deleting
    let orderItemCount = yield sequelize_1.sequelize.query(`
        SELECT COUNT(*)
        FROM "orderItems" AS oi
        where "orderId"=$1
    `, {
        bind: [orderId],
        type: sequelize_2.QueryTypes.SELECT,
    }).then((query) => parseInt(query[0].count));
    console.log("orderItemCount", orderItemCount);
    console.log("orderItemCount", typeof orderItemCount);
    if (!orderItemCount) {
        console.log("orderID", orderId);
        const res = yield order_model_1.Order.destroy({
            where: {
                id: orderId
            }
        });
        console.log("res", res);
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.updateProductFromOrder = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, orderId } = req.params;
    const { units } = req.body;
    if (units * 1 <= 0)
        return next(new utility_1.AppError('units can\'t be ZERO or NEGATIVE,' +
            ' you can delete the product from the order instead', 404));
    const order = yield order_model_1.Order.findByPk(orderId).then(order => order === null || order === void 0 ? void 0 : order.toJSON());
    if (!order || order.customerId != req.user.id)
        return next(new utility_1.AppError('order not found', 404));
    if (order.status === 'Delivered' ||
        order.status === 'Out for Delivery' ||
        order.status === 'Canceled')
        return next(new utility_1.AppError('you can\'t modify this order now order', 400));
    const [rowsAffected] = yield order_model_1.OrderItem.update({ units }, {
        where: {
            productId,
            orderId
        },
    });
    if (!rowsAffected)
        return next(new utility_1.AppError('Nothing was updated even the order don\'t' +
            ' have this product or you don\'t provide "units" in request body', 404));
    res.status(200).json({
        status: "success",
    });
}));
exports.addProductFromOrder = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, orderId } = req.params;
    const { units } = req.body;
    if (units * 1 <= 0)
        return next(new utility_1.AppError('units can\'t be ZERO or NEGATIVE,' +
            ' you can delete the product from the order instead', 404));
    const order = yield order_model_1.Order.findByPk(orderId).then(order => order === null || order === void 0 ? void 0 : order.toJSON());
    if (!order || order.customerId != req.user.id)
        return next(new utility_1.AppError('order not found', 404));
    if (order.status !== 'Pending')
        return next(new utility_1.AppError('you can\'t modify this order now order', 400));
    const product = yield models_1.Product.findByPk(productId).then(product => product === null || product === void 0 ? void 0 : product.toJSON());
    if (!product) {
        return next(new utility_1.AppError('product don\'t exist', 404));
    }
    const orderItem = yield order_model_1.OrderItem.create({ units, orderId: order.id, price: product.price, productId: product.id });
    res.status(201).json({
        status: "success",
        orderItem
    });
}));
exports.getVendorOrderItems = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderItems = yield order_model_1.OrderItem.findAll({
        include: [
            {
                model: models_1.Product,
                where: {
                    vendorId: req.user.id
                },
                attributes: []
            },
            {
                model: order_model_1.Order,
                where: {
                    status: {
                        [sequelize_2.Op.eq]: 'Delivered'
                    }
                },
                include: []
            }
        ],
        attributes: ['units', 'price', 'productId'],
    });
    res.status(200).json({
        status: "success",
        orderItems
    });
}));
const sendNotifcation = (to, from, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Notification.create({ to, from, message });
});
exports.sendNotifcation = sendNotifcation;
const selectDelivery = () => __awaiter(void 0, void 0, void 0, function* () {
    // Choose delivery with min last Date of order
    return yield sequelize_1.sequelize.query(`
            SELECT id,name,phone
            FROM users
            WHERE role = 'delivery'
            ORDER BY "lastDelivery"
            LIMIT 1
        `, {
        type: sequelize_2.QueryTypes.SELECT,
    }).then(query => query[0]);
});
const updateLastDeliveryDate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.User.update({ lastDelivery: Date.now() }, {
        where: {
            id
        }
    });
});
const updateOrderDate = (orderData, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.Order.update(orderData, {
        where: {
            id,
            status: { [sequelize_2.Op.ne]: orderData.status || 'Pending' }
        },
        returning: true,
    });
});
const buildDeliveryMessage = (delivery, customer, order) => {
    return `Hello, ${delivery.name} ` +
        `you have a delivery at https://www.google.com/maps?q=${order.lat},${order.lon} used`
        + `use this number to contact with customer ${customer.phone} `
        + `order id: ${order.id}`;
};
exports.confirmOrder = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let [rowsAffected, updatedOrder] = yield updateOrderDate({ status: 'Confirmed' }, parseInt(req.params.id));
    if (!updatedOrder.length)
        return next(new utility_1.AppError('order not found or updated before', 400));
    const delivery = yield selectDelivery();
    yield updateLastDeliveryDate(delivery.id);
    [rowsAffected, updatedOrder] = yield updateOrderDate({ deliveryId: delivery.id }, parseInt(req.params.id));
    const customer = yield models_1.User.findByPk(updatedOrder[0].dataValues.customerId).then(c => c.toJSON());
    const message = buildDeliveryMessage(delivery, customer, updatedOrder[0].dataValues);
    yield (0, exports.sendNotifcation)(delivery.id, req.user.id, message);
    res.status(200).json({
        status: "success",
        data: {
            order: updatedOrder[0]
        }
    });
}));
exports.markOrderAsDelivered = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let [rowsAffected, updatedOrder] = yield updateOrderDate({ status: 'Delivered' }, parseInt(req.params.id));
    if (!updatedOrder.length)
        return next(new utility_1.AppError('order Delivered before', 400));
    const message = `Hello, Your order was delivered` +
        ` if you have any compliant visit /api/v1/complaints`;
    // send the message
    yield (0, exports.sendNotifcation)(updatedOrder[0].dataValues.customerId, req.user.id, message);
    return res.status(200).json({
        status: "success",
        data: {
            order: updatedOrder[0]
        }
    });
}));
exports.isTheCorrectOrderDelivery = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findOne({
        where: {
            id: parseInt(req.params.id),
            deliveryId: req.user.id
        }
    });
    if (order)
        return next();
    next(new utility_1.AppError('order not exists', 404));
}));
exports.updateOrderLocation = (0, utility_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { lat, lon } = req.body;
    if (!lat || !lon)
        return next(new utility_1.AppError('Please provide both lat,lon in the request body', 400));
    const order = yield order_model_1.Order.findByPk(id).then(order => order === null || order === void 0 ? void 0 : order.toJSON());
    console.log(order, req.user.id, id);
    if (!order || order.customerId != req.user.id)
        return next(new utility_1.AppError('order not found', 404));
    if (order.status !== 'Pending')
        return next(new utility_1.AppError('you can\'t modify this order now order', 400));
    const [_, updatedOrder] = yield order_model_1.Order.update({ lat, lon }, {
        where: {
            id
        },
        returning: true
    });
    res.status(200).json({
        status: "success",
        order: updatedOrder
    });
}));
