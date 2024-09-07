"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const user_model_1 = require("./user.model");
class Vendor extends sequelize_1.Model {
    static modelName() {
        return 'vendors';
    }
}
exports.Vendor = Vendor;
Vendor.init({
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
    },
    serviceAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    images: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: Vendor.modelName(),
    timestamps: false,
});
user_model_1.User.hasOne(Vendor, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Vendor.User = Vendor.belongsTo(user_model_1.User, { as: 'user' });
