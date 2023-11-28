import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'

// @desc  Fetch all products
// @route Get api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 4
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {}

  const count = await Product.countDocuments({ ...keyword })

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc  Fetch product by id
// @route Get api/products/:id
// @access public
const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    return res.json(product)
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

// @desc  Create New product
// @route POST api/products
// @access Protected/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = new Product({
      user: req.user._id,
      name: 'sample name',
      image: '/images/sample.jpg',
      description: 'sample description',
      brand: 'sample brand',
      category: 'sample category',
      price: 0,
      countInStock: 0,
      rating: 0,
      numReviews: 0,
    })
    const newProduct = await product.save()
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(400)
    throw new Error('Product not created')
  }
})

// @desc  Update product
// @route PUT api/products/:id
// @access Protected/Admin
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, image, description, brand, category, price, countInStock } =
      req.body
    // console.log({ ...req.body })
    const product = await Product.findById(req.params.id)
    if (product) {
      product.name = name
      product.image = image
      product.description = description
      product.brand = brand
      product.category = category
      product.price = price
      product.countInStock = countInStock

      const updatedProduct = await product.save()
      // console.log(updatedProduct)

      res.json(updatedProduct)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// @desc  Delete product
// @route PUT api/products/:id
// @access Protected/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id })
    if (result.deletedCount === 1) {
      return res.status(200).send('Product deleted successfully')
    } else {
      return res.status(404).send('Product not found')
    }
  } catch (err) {
    res.status(500).send(`Error deleting Product: ${err.message}`)
  }
})

// @desc  Post a new review
// @route POST api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    )
    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review Added' })
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

// @desc  Fetch 3 Top-Rated Products
// @route Get api/products/top
// @access public
const getTopRatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({}).sort({ rating: -1 }).limit(3)
  if (product) {
    return res.json(product)
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

export {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopRatedProducts,
}
