import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopRatedProducts,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, admin, createProduct)
// router.get('/', getProducts) we can also use this

router.route('/top').get(getTopRatedProducts)
router
  .route('/:id')
  .get(getProductsById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct)

router.route('/:id/reviews').post(protect, createProductReview)
export default router
