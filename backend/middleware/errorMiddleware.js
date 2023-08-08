const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  //   let message = err.message

  //check for Mongoose bad Object
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    err.message = 'Resource not found'
    statusCode = 404
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'null' : err.stack,
  })
}

export { notFound, errorHandler }
