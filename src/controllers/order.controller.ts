import {Order, OrderItem} from "../models/order.model";
import {createFactory, deleteFactory, getAllFactory, getOneFactory, updateFactory} from "./handlerFactory";
import {AppError, catchAsync} from "../utility";
import {sequelize} from "../utility/sequelize";
import {QueryTypes} from "sequelize";
import {Cart, Product} from "../models";
export const getAllOrders=getAllFactory(Order);

export const deleteOrder=catchAsync (async (req,res,next)=>{
    const count= await Order.destroy({
        where:{id:req.params.id,customerId:req.user!.id}

    });
    if(!count){
        return next(new AppError("you don't have such an order",404));
    }
    res.status(204).json({
        status:"success",
        data:null,
    })
})
export const updateOrder=updateFactory(Order);
// export const getOneOrder=getOneFactory(Order);

export const createOrder = catchAsync(async (req,res,next)=>{
    req.body.customerId = req.user!.id;
    // Calc Paid amount
    const result = await sequelize.query(`
        SELECT price,units,"productId"
        FROM products as p
        JOIN carts as c
        ON p.id = c."productId"
        WHERE c."customerId" = $1
        `,
        {
            bind: [req.user!.id*1],
            type: QueryTypes.SELECT,
        },
    )
    console.log(result)
    if(result.length<1)
        return next(new AppError('your cart is empty,please add some product to the cart',400))
    let totalPrice = 0
    result.forEach((row)=>{
        totalPrice += row.price * row.units;
    })
    // Create order
    const order=await Order.create(req.body);
    order.dataValues.totalPrice = totalPrice
    // Add orderId to result array elements
    result.forEach((item)=>{
        item.orderId = order.dataValues.id
    })
    // Fill order items
    await OrderItem.bulkCreate(result,{validate:true});
    // delete the cart of the user
    await Cart.destroy({
        where:{
            customerId:req.user!.id
        }
    })
    console.log({...order.dataValues,totalPrice})
    res.status(201).json({
        status:"success",
        data:{
            order:{...order.dataValues,totalPrice}
        }
    })
})
export const getOrderDetails = catchAsync(async (req,res,next)=>{
    const orderId = req.params.id;
    let order = await Order.findByPk(orderId,{
        include: {
            model: Product,
            attributes: ['id', 'name', 'vendorId', 'images',],
            through: {
                model: OrderItem,
                attributes: ['units', 'price'],
            }
        }
    }).then(order=>order?.toJSON())
    if(order&&req.user!.id !== order!.customerId&&req.user!.role !== 'admin')
        order = null;
    let totalPrice = 0;
    if(order){
        order.products.forEach(product=>{
            product.units=product.orderItems.units;
            product.price=product.orderItems.price;
            totalPrice += product.units * product.price;
            delete product.orderItems
        })
        order.totalPrice = totalPrice
    }
    res.status(200).json({
        status:"success",
        order
    })

})

export const getMyOrders = catchAsync(async (req,res,next)=>{
    const orders = await sequelize.query(`
        SELECT "totalPrice",o.id AS "orderId",status,"createdAt","updatedAt"
        FROM 
            (SELECT SUM(units * price) as "totalPrice", o.id
            FROM orders AS o 
            JOIN "orderItems" AS oi
            ON o.id = oi."orderId"
            WHERE o."customerId"=$1
            GROUP BY o.id) as o_price
        JOIN orders as o 
        ON o.id = o_price.id 
    `,
        {
            bind: [req.user!.id*1],
            type: QueryTypes.SELECT,
        }

    )
    console.log(orders);
    res.status(200).json({
        status:"success",
        orders
    })
})

export const deleteProductFromOrder = catchAsync(async (req,res,next)=>{
    const {productId,orderId} = req.params;
    const order = await Order.findByPk(orderId).then(order=>order?.toJSON());
    if(!order||order.customerId !== req.user!.id)
        return next(new AppError('order not found',404));
    if(order.status === 'Delivered' ||
        order.status === 'Out for Delivery' ||
        order.status === 'Canceled'
    ) return next(new AppError('you can\'t modify this order now order',400));
    const item = await OrderItem.destroy({
        where:{
            productId,
            orderId
        }
    })
    if(!item)
        return next(new AppError('no such an item in the order',404));
    //delete the order if no items in it after deleting
    //TODO: it make it a database trigger
    const orderItemCount = await sequelize.query(`
        SELECT COUNT(*)
        FROM "orderItems" AS oi
        where "orderId"=$1
    `,{
        bind:[orderId],
        type: QueryTypes.SELECT,
    }).then(query=>query[0].count*1);

    console.log("orderItemCount",orderItemCount)
    console.log("orderItemCount",typeof orderItemCount)
    if(!orderItemCount){
        console.log("orderID",orderId)
        const res= await Order.destroy({
            where:{
                id:orderId
            }
        })
        console.log("res",res);
    }
    res.status(204).json({
        status:"success",
        data:null,
    })
})
export const updateProductFromOrder = catchAsync(async (req,res,next)=>{
    const {productId,orderId} = req.params;
    const {units} = req.body;
    if(units*1 === 0)
        return next(new AppError('units can\'t be ZERO,' +
            ' you can delete the product from the order instead',404));
    const order = await Order.findByPk(orderId).then(order=>order?.toJSON());
    if(!order||order.customerId !== req.user!.id)
        return next(new AppError('order not found',404));
    if(order.status === 'Delivered' ||
        order.status === 'Out for Delivery' ||
        order.status === 'Canceled'
    ) return next(new AppError('you can\'t modify this order now order',400));
    const [rowsAffected] = await OrderItem.update({units},{
        where:{
            productId,
            orderId
        },
    })
    if(!rowsAffected)
        return next(new AppError('Nothing was updated even the order don\'t' +
            ' have this product or you don\'t provide "units" in request body',404));

    res.status(200).json({
        status:"success",
    })
})