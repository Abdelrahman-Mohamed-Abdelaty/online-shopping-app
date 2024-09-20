import {Model, DataTypes, WhereAttributeHashValue} from 'sequelize';
import {sequelize} from "../utility/sequelize";
import {Product} from "./product.model";
import {User} from "./user.model";
import { FindOptions } from 'sequelize';

class Order extends Model {
    declare customerId:number
    declare id:number;
}
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
        type: DataTypes.BIGINT,
    },
    customerId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    lat:{
        type:DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: -90,
            max: 90,
        },
    },
    lon:{
        type:DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: -180,
            max: 180,
        },
    },
    totalPrice:{
        type:DataTypes.FLOAT,
    }
    }
    , {
        sequelize,
        modelName: 'orders',
        timestamps: true,
    }
)
const buildUpdatePriceQuery = (id:WhereAttributeHashValue<number>|null)=>{
    let query = `
        UPDATE orders AS outOrder
            SET "totalPrice" =
                      (SELECT SUM(units * price)
                       FROM orders AS o
                                JOIN "orderItems" AS oi
                                     ON o.id = oi."orderId"
                       WHERE o."id"=outOrder.id
                       GROUP BY o.id)
    `
    if(id) query = query+'\n'+'WHERE outOrder.id=$1'
    return query;
}
Order.addHook('beforeFind','',async (options: FindOptions<Order>)=>{
    if(options.attributes&&!(options.attributes as string[]).includes('totalPrice"')) return;
    if('id' in options.where!){
        const query = buildUpdatePriceQuery(options.where!.id);
        await sequelize.query(query,{
            bind:[options.where!.id]
        })
        return;
    }
    const query = buildUpdatePriceQuery(null);
    await sequelize.query(query)
})


class OrderItem extends Model {
    price: number | undefined;
    units: number | undefined;
    id: number | undefined;
    orderId: number | undefined
}
OrderItem.init({
    units:{
        type:DataTypes.INTEGER,
    },
    price:{
        type:DataTypes.FLOAT
    },
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

Product.hasMany(OrderItem,{
    foreignKey:'productId'
})
OrderItem.belongsTo(Product,{
    foreignKey:'productId'
})
Order.hasMany(OrderItem,{
    foreignKey:'orderId'
})
OrderItem.belongsTo(Order,{
    foreignKey:'orderId'
})

export {OrderItem,Order}
