"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../utility/sequelize");
const user_model_1 = require("./user.model");
class Offer extends sequelize_1.Model {
}
exports.Offer = Offer;
Offer.init({
    offerType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    minValue: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    offerAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    startValidity: {
        type: sequelize_1.DataTypes.DATE,
    },
    endValidity: {
        type: sequelize_1.DataTypes.DATE,
    },
    promocode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    promoType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bank: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    bins: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
    pincode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'Offers',
    timestamps: true,
});
user_model_1.User.belongsToMany(Offer, {
    through: 'vendorsOffers'
});
Offer.belongsToMany(user_model_1.User, {
    through: 'vendorsOffers'
});
