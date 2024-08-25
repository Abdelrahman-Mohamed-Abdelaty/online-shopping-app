import {DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {Customer} from "./customer.model";
import {Vendor} from "./vendor.model";

class Product extends Model{
    static modelName(){
        return 'products'
    }
}
Product.init(
    {
        id:{
            type:DataTypes.BIGINT,
            autoIncrement:true,
            primaryKey:true
        },
        vendorId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        foodType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        readyTime: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        }
    },
    {
        sequelize,
        modelName:Product.modelName(),
        timestamps: false,
    },
);

// Cart.hasMany(Product, {
//     onDelete: 'NO',
//     onUpdate: 'CASCADE',
//     foreignKey:'customerId'
// });
// Product.belongsTo(Cart,{
//     foreignKey:'customerId'
// });
Vendor.hasMany(Product,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'vendorId'
})
Product.belongsTo(Vendor,{
    foreignKey:'vendorId'
})
export  {Product};