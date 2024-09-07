import {Model, DataTypes} from 'sequelize';
import {sequelize} from "../utility/sequelize";
import {Product} from "./product.model";
import {User} from "./user.model";

class Order extends Model {}
Order.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    // paidAmount: {
    //     type: DataTypes.FLOAT,
    //     allowNull: false
    // },
    // date: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW
    // },
    status: {
        type: DataTypes.ENUM('Pending','Confirmed','Out for Delivery','Canceled','Delivered'),
        allowNull:false,
        defaultValue:'Pending'
    },
    deliveryId: {
        type: DataTypes.INTEGER,
    },
    customerId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
    }
    , {
        sequelize,
        modelName: 'orders',
        timestamps: true,
    }
)



class OrderItem extends Model {}
OrderItem.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    units:{
        type:DataTypes.INTEGER,
    },
    price:{
        type:DataTypes.FLOAT
    }
    }
    , {
        sequelize,
        modelName: 'orderItems',
        timestamps: true,
    }
)

User.hasMany(Order,{
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    foreignKey:'customerId'}
)
Order.belongsTo(User,{
    foreignKey:'customerId'
})

User.hasMany(Order,{
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    foreignKey:'deliveryId'}
)
Order.belongsTo(User,{
    foreignKey:'deliveryId'
})
Order.belongsToMany(Product,{
    through:OrderItem
})
Product.belongsToMany(Order,{
    through:OrderItem
})

// Order.hasMany(OrderItem,{
//     foreignKey:'orderId'
// })
// OrderItem.hasMany(Order,{
//     foreignKey:'orderId'
// })

export {OrderItem,Order}
