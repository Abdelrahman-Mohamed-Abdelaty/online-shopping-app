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
exports.Order = exports.OrderItem = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const product_model_1 = require("./product.model");
const user_model_1 = require("./user.model");
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // paidAmount: {
    //     type: DataTypes.FLOAT,
    //     allowNull: false
    // },
    // date: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW
    // },
    status: {
        type: sequelize_1.DataTypes.ENUM('Pending', 'Confirmed', 'Out for Delivery', 'Canceled', 'Delivered'),
        allowNull: false,
        defaultValue: 'Pending'
    },
    deliveryId: {
        type: sequelize_1.DataTypes.BIGINT,
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    lat: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: -90,
            max: 90,
        },
    },
    lon: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: -180,
            max: 180,
        },
    },
    totalPrice: {
        type: sequelize_1.DataTypes.FLOAT,
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'orders',
    timestamps: true,
});
const buildUpdatePriceQuery = (id) => {
    let query = `
        UPDATE orders AS outOrder
            SET "totalPrice" =
                      (SELECT SUM(units * price)
                       FROM orders AS o
                                JOIN "orderItems" AS oi
                                     ON o.id = oi."orderId"
                       WHERE o."id"=outOrder.id
                       GROUP BY o.id)
    `;
    if (id)
        query = query + '\n' + 'WHERE outOrder.id=$1';
    return query;
};
Order.addHook('beforeFind', '', (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (options.attributes && !options.attributes.includes('totalPrice"'))
        return;
    if ('id' in options.where) {
        const query = buildUpdatePriceQuery(options.where.id);
        yield sequelize_2.sequelize.query(query, {
            bind: [options.where.id]
        });
        return;
    }
    const query = buildUpdatePriceQuery(null);
    yield sequelize_2.sequelize.query(query);
}));
class OrderItem extends sequelize_1.Model {
}
exports.OrderItem = OrderItem;
OrderItem.init({
    units: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'orderItems',
    timestamps: true,
});
user_model_1.User.hasMany(Order, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    foreignKey: 'customerId'
});
Order.belongsTo(user_model_1.User, {
    foreignKey: 'customerId'
});
user_model_1.User.hasMany(Order, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    foreignKey: 'deliveryId'
});
Order.belongsTo(user_model_1.User, {
    foreignKey: 'deliveryId'
});
Order.belongsToMany(product_model_1.Product, {
    through: OrderItem
});
product_model_1.Product.belongsToMany(Order, {
    through: OrderItem
});
product_model_1.Product.hasMany(OrderItem, {
    foreignKey: 'productId'
});
OrderItem.belongsTo(product_model_1.Product, {
    foreignKey: 'productId'
});
Order.hasMany(OrderItem, {
    foreignKey: 'orderId'
});
OrderItem.belongsTo(Order, {
    foreignKey: 'orderId'
});
