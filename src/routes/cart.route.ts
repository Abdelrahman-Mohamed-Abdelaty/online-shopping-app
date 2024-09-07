import {Router} from "express";
import {
    addProductToCart, deleteProductFromCart,
    getCartOfCustomer,
    isTheProductExist,
    isVendorAvailable,
    protect,
    restrictTo
} from "../controllers";

const router = Router();


router.use(protect)
router.use(restrictTo('customer'))

// Cart Routes
router.post('/:id',isTheProductExist,isVendorAvailable,addProductToCart);
router.get('/',getCartOfCustomer)
router.delete('/:id?',deleteProductFromCart)


export {router as cartRoute};