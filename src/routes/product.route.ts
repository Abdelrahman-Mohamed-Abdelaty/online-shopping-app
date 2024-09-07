import {NextFunction, Router} from "express";
import {
    canChangeProduct,
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    protect, resizeProductPhotos,
    restrictTo, setVendorId,
    updateProduct, uploadProductPhotos, validateImages
} from "../controllers";

const router=Router();

router.get('/',getAllProducts)
router.get('/:id',getProductById)

router.use(protect)
router.use(restrictTo('vendor','admin'))

router.post('/',uploadProductPhotos,resizeProductPhotos,validateImages,setVendorId,createProduct)
router.patch('/:id',canChangeProduct,uploadProductPhotos,resizeProductPhotos,updateProduct)
router.delete('/:id',canChangeProduct,deleteProduct)

export {router as productRoute}