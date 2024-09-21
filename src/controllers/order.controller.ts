import {Order, OrderItem} from "../models/order.model";
import {getAllFactory, getOneFactory, updateFactory} from "./handlerFactory";
import {AppError, catchAsync} from "../utility";
import {sequelize} from "../utility/sequelize";
import {Op, QueryTypes,Includeable} from "sequelize";
import {Cart, Product, Notification, User} from "../models";
import {IUser} from "../dto";

export const getAllOrders = getAllFactory(Order);

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

const getUserCartItems = async (userId:number)=>{
    return await sequelize.query(`
        SELECT price,units,"productId"
        FROM products as p
        JOIN carts as c
        ON p.id = c."productId"
        WHERE c."customerId" = $1
        `,
        {
            bind: [userId],
            type: QueryTypes.SELECT,
        },
    ) as OrderItem[]
}
const calcTotalPrice = (items:OrderItem[])=>{
    let totalPrice = 0
    items.forEach((item)=>{
        totalPrice += item.price! * item.units!;
    })
    return totalPrice;
}
export const createOrder = catchAsync(async (req,res,next)=>{
    req.body.customerId = req.user.id;
    const result = await getUserCartItems(req.user.id)
    if(result.length<1)
        return next(new AppError('your cart is empty,please add some product to the cart',400))
    const totalPrice = calcTotalPrice(result)
    // Create order
    req.body.lat = req.body.lat || req.user!.lat
    req.body.lon = req.body.lon || req.user!.lon
    const order=await Order.create(req.body);
    order.dataValues.totalPrice = totalPrice
    // Add orderId to result array elements
    result.forEach((item)=>{
        item.orderId = order.dataValues.id
    })
    // Fill order items
    await OrderItem.bulkCreate(result as Array<Partial<OrderItem>>,{validate:true});
    // delete the cart of the user
    await Cart.destroy({
        where:{
            customerId:req.user!.id
        }
    })
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
        } as Includeable
    }).then(order=>order?.toJSON())
    if(order&&req.user!.id != order!.customerId&&req.user!.role !== 'admin')
        order = null;
    if(order){
        order.products.forEach((product:any)=>{
            product.units=product.orderItems.units;
            product.price=product.orderItems.price;
            delete product.orderItems
        })
    }else
        return next(new AppError('order not found',404));
    res.status(200).json({
        status:"success",
        order
    })

})
export const deleteProductFromOrder = catchAsync(async (req,res,next)=>{
    const {productId,orderId} = req.params;
    const order = await Order.findByPk(orderId).then(order=>order?.toJSON());
    if(!order||order.customerId != req.user!.id)
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
    let orderItemCount = await sequelize.query(`
        SELECT COUNT(*)
        FROM "orderItems" AS oi
        where "orderId"=$1
    `,{
        bind:[orderId],
        type: QueryTypes.SELECT,
    }).then((query)=>parseInt((query[0] as { count: string }).count));
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
    if(units*1 <= 0)
        return next(new AppError('units can\'t be ZERO or NEGATIVE,' +
            ' you can delete the product from the order instead',404));
    const order = await Order.findByPk(orderId).then(order=>order?.toJSON());
    if(!order||order.customerId != req.user!.id)
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
export const addProductFromOrder = catchAsync(async (req,res,next)=>{
    const {productId,orderId} = req.params;
    const {units} = req.body;
    if(units*1 <= 0)
        return next(new AppError('units can\'t be ZERO or NEGATIVE,' +
            ' you can delete the product from the order instead',404));

    const order = await Order.findByPk(orderId).then(order=>order?.toJSON());
    if(!order||order.customerId != req.user!.id)
        return next(new AppError('order not found',404));
    if(order.status !== 'Pending')
        return next(new AppError('you can\'t modify this order now order',400));

    const product = await Product.findByPk(productId).then(product=>product?.toJSON());
    if(!product){
        return next(new AppError('product don\'t exist',404));
    }
    const orderItem = await OrderItem.create({units,orderId:order.id,price:product.price,productId:product.id})
    res.status(201).json({
        status:"success",
        orderItem
    })
})

export const getVendorOrderItems = catchAsync(async (req,res,next)=>{
    const orderItems = await OrderItem.findAll({
        include:[
            {
            model:Product,
            where:{
                vendorId:req.user!.id
            },
            attributes:[]
            },
            {
                model:Order,
                where:{
                    status:{
                        [Op.eq]:'Delivered'
                    }
                },
                include:[]
            }
        ],
        attributes:['units','price','productId'],
    })
    res.status(200).json({
        status:"success",
        orderItems
    })
})
export const sendNotifcation = async(to:number,from:number,message:string)=>{
    await Notification.create({to,from,message})
}

const selectDelivery = async ()=>{
    // Choose delivery with min last Date of order
    return await sequelize.query(`
            SELECT id,name,phone
            FROM users
            WHERE role = 'delivery'
            ORDER BY "lastDelivery"
            LIMIT 1
        `,{
        type: QueryTypes.SELECT,
    }).then(query=>query[0]) as IUser
}

const updateLastDeliveryDate = async (id:number)=>{
    await User.update({lastDelivery:Date.now()},{
        where:{
            id
        }
    })
}
interface IOrder{
    status?:string;
    id?:number;
    deliveryId?:number;
    lat?:number;
    lon?:number;
}
const updateOrderDate =async (orderData:IOrder,id:number)=>{
    return await Order.update(orderData,{
        where:{
            id,
            status:{[Op.ne]:orderData.status||'Pending'}
        },
        returning: true,
    });

}
const buildDeliveryMessage =  (delivery:IUser,customer:IUser,order:IOrder)=>{
    return `Hello, ${delivery.name} `+
    `you have a delivery at https://www.google.com/maps?q=${order.lat},${order.lon} used`
    +`use this number to contact with customer ${customer.phone} `
    +`order id: ${order.id}`
}

export const confirmOrder = catchAsync(async (req,res,next)=>{
    let [rowsAffected,updatedOrder] = await updateOrderDate({status: 'Confirmed'},parseInt(req.params.id))
    if(!updatedOrder.length)
        return next(new AppError('order not found or updated before',400))
    const delivery = await selectDelivery();
    await updateLastDeliveryDate(delivery.id);
    [rowsAffected,updatedOrder] = await updateOrderDate({deliveryId:delivery.id},parseInt(req.params.id,))
    const customer = await User.findByPk(updatedOrder[0].dataValues.customerId).then(c=>c!.toJSON()) as IUser;
    const message = buildDeliveryMessage(delivery,customer,updatedOrder[0].dataValues)
    await sendNotifcation(delivery.id,req.user!.id,message);
    res.status(200).json({
        status:"success",
        data:{
            order:updatedOrder[0]
        }
    })
})

export const markOrderAsDelivered = catchAsync(async (req,res,next)=>{
    let [rowsAffected,updatedOrder] = await updateOrderDate({status: 'Delivered'},parseInt(req.params.id))
    if(!updatedOrder.length)
        return next(new AppError('order Delivered before',400))
    const message = `Hello, Your order was delivered`+
        ` if you have any compliant visit /api/v1/complaints`
    // send the message
    await sendNotifcation(updatedOrder[0].dataValues.customerId,req.user!.id,message);
    return res.status(200).json({
        status:"success",
        data:{
            order:updatedOrder[0]
        }
    })
})
export const isTheCorrectOrderDelivery = catchAsync(async (req,res,next)=>{
   const order = await Order.findOne({
       where:{
            id:parseInt(req.params.id),
            deliveryId:req.user.id
       }});
   if(order) return next();
   next(new AppError('order not exists',404))
})

export const updateOrderLocation = catchAsync(async (req,res,next)=>{
    const {id} = req.params;
    const {lat,lon} = req.body;
    if(!lat || !lon)
        return next(new AppError('Please provide both lat,lon in the request body',400));
    const order = await Order.findByPk(id).then(order=>order?.toJSON());
    console.log(order,req.user.id,id)
    if(!order||order.customerId != req.user!.id)
        return next(new AppError('order not found',404));
    if(order.status !== 'Pending')
        return next(new AppError('you can\'t modify this order now order',400));
   const [_,updatedOrder] = await Order.update({lat,lon},{
        where:{
            id
        },
        returning:true
    })
    res.status(200).json({
        status:"success",
        order:updatedOrder
    })
})