"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const user_model_1 = require("./user.model");
class Delivery extends sequelize_1.Model {
    static modelName() {
        return 'deliveries';
    }
}
exports.Delivery = Delivery;
Delivery.init({
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
    },
    isAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN
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
    modelName: Delivery.modelName(),
    timestamps: false,
});
user_model_1.User.hasOne(Delivery, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Delivery.User = Delivery.belongsTo(user_model_1.User, { as: 'user' });
