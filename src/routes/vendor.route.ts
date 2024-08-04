import {Router,Request,Response,NextFunction} from 'express'
import {createVendor, deleteVendor, getAllVendors, getVendorById, welcomeVendor} from "../controllers";

const router=Router();

router.get("/",getAllVendors)
router.get("/:id",getVendorById)
router.post('/',createVendor)
router.delete('/:id',deleteVendor)

export {router as vendorRoute}