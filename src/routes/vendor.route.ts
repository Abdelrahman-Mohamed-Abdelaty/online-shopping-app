import {Router} from 'express'
import {getVendorById, protect} from "../controllers";
const router=Router();

router.use(protect)

// Get all vendors
// router.get('/:id/products',getProductsOfVendor)
router.get('/:id',getVendorById)
export {router as vendorRoute}