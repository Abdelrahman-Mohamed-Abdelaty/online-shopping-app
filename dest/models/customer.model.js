"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const user_model_1 = require("./user.model");
class Customer extends sequelize_1.Model {
    static modelName() {
        return 'customers';
    }
}
exports.Customer = Customer;
Customer.init({
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER
    },
    otpExpiry: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: Customer.modelName(),
    timestamps: false,
});
user_model_1.User.hasOne(Customer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Customer.User = Customer.belongsTo(user_model_1.User, { as: 'user' });
