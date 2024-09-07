import {BelongsTo, DataTypes, Model} from 'sequelize'
import {sequelize} from "../utility/sequelize";
import {Product} from "./product.model";
import {User} from "./user.model";


class Cart extends Model{
    static modelName(){
        return 'carts'
    }
}

Cart.init(
    {
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true,
        },
        customerId:{
            type:DataTypes.BIGINT,
            allowNull:false,
            unique:'customer-product'
        },
        productId:{
            type:DataTypes.BIGINT,
            allowNull:false,
            unique:'customer-product'
        },
        units:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },
    {
        sequelize,
        modelName:Cart.modelName(),
        timestamps: false,
    },
);
User.hasMany(Cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'customerId'
});
Cart.belongsTo(User,{
    foreignKey:'customerId'
});

Product.hasMany(Cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'productId'
})
Cart.belongsTo(Product,{
    foreignKey:'productId'
});
export  {Cart};
