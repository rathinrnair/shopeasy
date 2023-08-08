import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

connectDB() // connect to mongo

const port = process.env.PORT || 5000

const app = express()

app.get('/', (req, res) => {
  res.send('api is running....')
})

app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () =>
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${port}`
  )
)
