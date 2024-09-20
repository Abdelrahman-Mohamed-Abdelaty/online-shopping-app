"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const user_model_1 = require("./user.model");
class Notification extends sequelize_1.Model {
    static modelName() {
        return 'notifications';
    }
}
exports.Notification = Notification;
Notification.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    seen: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    to: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    from: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: Notification.modelName(),
    timestamps: true,
});
user_model_1.User.hasMany(Notification, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'to'
});
Notification.belongsTo(user_model_1.User, {
    foreignKey: 'to'
});
user_model_1.User.hasMany(Notification, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'from'
});
Notification.belongsTo(user_model_1.User, {
    foreignKey: 'from'
});
