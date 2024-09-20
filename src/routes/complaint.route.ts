import {Router} from "express";
import {
    canDeleteComplaint, canUpdateComplaint,
    createComplaint,
    deleteComplaint,
    deleteStatusFromBody,
    getAllComplaints,
    protect,
    restrictTo,
    setCustomerId,
    updateComplaint
} from "../controllers";

const router = Router();


router.use(protect)

router.get('/',restrictTo('admin'),getAllComplaints)
router.post('/',restrictTo('customer'),deleteStatusFromBody,setCustomerId,createComplaint);
router.delete('/:id',restrictTo('customer'),canDeleteComplaint,deleteComplaint)
router.patch('/:id',restrictTo('admin','customer'),canUpdateComplaint,updateComplaint)


export {router as complaintRoute};
