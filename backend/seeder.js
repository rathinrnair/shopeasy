import mongoose from 'mongoose'
import products from './data/products.js'
import users from './data/users.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import User from './models/userModel.js'
import connectDB from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await User.deleteMany()
    await Order.deleteMany()
    await Product.deleteMany()
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })

    await Product.insertMany(sampleProducts)
    console.log('Data Imported')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await User.deleteMany()
    await Order.deleteMany()
    await Product.deleteMany()
    console.log('Data Destroyed')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
