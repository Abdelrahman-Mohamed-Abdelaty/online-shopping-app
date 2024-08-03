import {Router,Request,Response,NextFunction} from 'express'
import {createVendor, welcomeVendor} from "../controllers";

const router=Router();

router.get("/",welcomeVendor)
router.post('/',createVendor)

export {router as vendorRoute}