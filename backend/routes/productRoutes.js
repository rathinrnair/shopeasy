import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductsById,
} from '../controllers/productController.js'

router.route('/').get(getProducts)
// router.get('/', getProducts) we can also use this

router.route('/:id').get(getProductsById)

export default router
