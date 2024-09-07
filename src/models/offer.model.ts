import {Model, DataTypes} from 'sequelize';
import {sequelize} from "../utility/sequelize";
import {User} from "./user.model";

class Offer extends Model {}

Offer.init({
    offerType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    minValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    offerAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    startValidity: {
        type: DataTypes.DATE,
    },
    endValidity: {
        type: DataTypes.DATE,
    },
    promocode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    promoType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bank: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    bins: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAvailable:{// for delivery and vendors instead of service availability
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    verified:{
        type:DataTypes.BOOLEAN
    },
}, {
    sequelize,
    modelName: 'Offers',
    timestamps: true,
});

User.belongsToMany(Offer,{
    through: 'vendorsOffers'
})
Offer.belongsToMany(User,{
    through: 'vendorsOffers'
})

export {Offer};
