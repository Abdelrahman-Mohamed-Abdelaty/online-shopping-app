import {BelongsTo, DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {Customer} from "./customer.model";


class Cart extends Model{
    static modelName(){
        return 'carts'
    }
}

Cart.init(
    {
        customerId:{
            type:DataTypes.BIGINT,
            primaryKey:true,
        },
    },
    {
        sequelize,
        modelName:Cart.modelName(),
        timestamps: false,
    },
);
Customer.hasOne(Cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'customerId'
});
Cart.belongsTo(Customer,{
    foreignKey:'customerId'
});
export  {Cart};