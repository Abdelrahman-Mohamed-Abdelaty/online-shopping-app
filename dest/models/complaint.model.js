"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complaint = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const user_model_1 = require("./user.model");
class Complaint extends sequelize_1.Model {
    static modelName() {
        return 'complaints';
    }
}
exports.Complaint = Complaint;
Complaint.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    topic: {
        type: sequelize_1.DataTypes.ENUM,
        values: ['order', 'delivery', 'other'],
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: ['under-review', 'reviewed', 'solved'],
        allowNull: false,
        defaultValue: 'under-review'
    },
    customerId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: Complaint.modelName(),
    timestamps: true,
});
user_model_1.User.hasMany(Complaint, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'customerId'
});
Complaint.belongsTo(user_model_1.User, {
    foreignKey: 'customerId'
});
