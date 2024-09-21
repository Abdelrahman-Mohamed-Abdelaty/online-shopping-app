import {Router} from 'express'
import {getVendorById, getVendorOrderItems, protect, restrictTo} from "../controllers";
const router=Router();

router.use(protect)

// Get all vendors
router.get('/orders',restrictTo('admin','vendor'),getVendorOrderItems)
router.get('/:id',getVendorById)

export {router as vendorRoute}