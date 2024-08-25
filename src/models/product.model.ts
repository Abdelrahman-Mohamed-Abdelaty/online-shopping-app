import {DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {Customer} from "./customer.model";
import {Cart} from "./cart.model";


class Product extends Model{
    static modelName(){
        return 'products'
    }
}

Product.init(
    {
        customerId:{
            type:DataTypes.BIGINT,
            primaryKey:true,
        },
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
export  {Product};