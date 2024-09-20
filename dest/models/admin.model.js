"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const user_model_1 = require("./user.model");
class Admin extends sequelize_1.Model {
    static modelName() {
        return 'admins';
    }
}
exports.Admin = Admin;
Admin.init({
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: Admin.modelName(),
    timestamps: false,
});
user_model_1.User.hasOne(Admin, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Admin.User = Admin.belongsTo(user_model_1.User, { as: 'user' });
