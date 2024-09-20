"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const vendor_model_1 = require("./vendor.model");
const order_model_1 = require("./order.model");
class Transaction extends sequelize_1.Model {
}
exports.Transaction = Transaction;
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    vendorId: {
        type: sequelize_1.DataTypes.BIGINT,
        references: {
            model: vendor_model_1.Vendor,
            key: 'userId',
        }
    },
    orderId: {
        type: sequelize_1.DataTypes.BIGINT,
        references: {
            model: order_model_1.Order,
            key: 'id',
        }
    },
    orderValue: {
        type: sequelize_1.DataTypes.FLOAT
    },
    offerUsed: {
        type: sequelize_1.DataTypes.STRING
    },
    status: {
        type: sequelize_1.DataTypes.STRING
    },
    paymentMode: {
        type: sequelize_1.DataTypes.STRING
    },
    paymentResponse: {
        type: sequelize_1.DataTypes.STRING
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'transactions',
    timestamps: true,
});
/**
 customer: String,
 vendorId: String,
 orderId: String,
 orderValue: Number,
 offerUsed: String,
 status: String,
 paymentMode: String,
 paymentResponse: String

 },{


 */ 
