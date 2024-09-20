"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const product_model_1 = require("./product.model");
const user_model_1 = require("./user.model");
class Cart extends sequelize_1.Model {
    static modelName() {
        return 'carts';
    }
}
exports.Cart = Cart;
Cart.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    customerId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        unique: 'customer-product'
    },
    productId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        unique: 'customer-product'
    },
    units: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: Cart.modelName(),
    timestamps: false,
});
user_model_1.User.hasMany(Cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'customerId'
});
Cart.belongsTo(user_model_1.User, {
    foreignKey: 'customerId'
});
product_model_1.Product.hasMany(Cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'productId'
});
Cart.belongsTo(product_model_1.Product, {
    foreignKey: 'productId'
});
