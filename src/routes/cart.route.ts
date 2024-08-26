import {Router} from "express";
import {addProductToCart, isTheProductExist, isVendorAvailable, protect, restrictTo} from "../controllers";

const router = Router();


router.use(protect)
router.use(restrictTo('customer'))

// Cart Routes
//add product to the cart
router.post('/:id',isTheProductExist,isVendorAvailable,addProductToCart);
//get products in user cart

//delete product from the cart
//update product in the cart
//delete everything in the cart



export {router as cartRoute};