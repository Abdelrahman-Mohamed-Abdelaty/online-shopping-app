import {Router} from "express";
import {
     createOrder, deleteOrder, deleteProduct, deleteProductFromOrder,
     getAllOrders, getOrderDetails,
     protect, restrictTo, updateOrder, updateProductFromOrder,
} from "../controllers";

const router = Router();


router.use(protect)
router.get('/',restrictTo('admin'),getAllOrders)
// router.get('/:id',restrictTo('admin'),getOneOrder);


//should be for customers only
router.post('/',restrictTo('customer'),createOrder);
router.delete('/:id',restrictTo('customer'),deleteOrder);
router.get('/:id',restrictTo('customer','admin'),getOrderDetails)
// router.patch('/:id',updateOrder)


//
// router.route('/:orderId/items/:itemId?')
//     .get()
//

router.route('/:orderId/products/:productId')
    .patch(restrictTo('customer'),updateProductFromOrder)
    .delete(restrictTo('customer'),deleteProductFromOrder);

// router.post('/:orderId/items/',)

export {router as orderRoute};