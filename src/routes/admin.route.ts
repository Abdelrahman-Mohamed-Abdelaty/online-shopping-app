import {Router,Request,Response,NextFunction} from "express";
import {welcomeAdmin} from "../controllers";

const router=Router();

router.get("/",welcomeAdmin)
export {router as adminRoute}