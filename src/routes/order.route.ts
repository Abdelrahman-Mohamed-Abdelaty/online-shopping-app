import {Router} from "express";
import {
     addProductFromOrder, confirmOrder,
     createOrder, deleteOrder, deleteProduct, deleteProductFromOrder,
     getAllOrders, getOrderDetails, isTheCorrectOrderDelivery, markOrderAsDelivered,
     protect, restrictTo, updateOrderLocation, updateProductFromOrder,
} from "../controllers";

const router = Router();


router.use(protect)
router.get('/',restrictTo('admin'),getAllOrders)

// router.patch('/:id',restrictTo('admin','delivery'),updateOrder
//     ,handleConfirmedOrder,handleDeliveredOrder);

router.patch('/confirm-order/:id',restrictTo('admin')
    ,confirmOrder);
router.patch('/delivery-order/:id',restrictTo('delivery')
    ,isTheCorrectOrderDelivery,markOrderAsDelivered);


//should be for customers only
router.post('/',restrictTo('customer'),createOrder);
router.delete('/:id',restrictTo('customer'),deleteOrder);
router.get('/:id',restrictTo('customer','admin'),getOrderDetails)
router.patch('/:id',restrictTo('customer'),updateOrderLocation)

router.route('/:orderId/products/:productId')
    .patch(restrictTo('customer'),updateProductFromOrder)
    .delete(restrictTo('customer'),deleteProductFromOrder)
    .post(restrictTo('customer'),addProductFromOrder);

export {router as orderRoute};