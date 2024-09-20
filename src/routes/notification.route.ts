import {Router} from "express";
import {canDeleteNotification, deleteNotificationById, protect} from "../controllers";


const router = Router();


router.use(protect)
router.delete('/:id',canDeleteNotification,deleteNotificationById)

export {router as notificationRoute};
