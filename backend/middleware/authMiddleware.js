import asyncHandler from './asyncHandler.js'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

// Protect Routes

const protect = asyncHandler(async (req, res, next) => {
  let token

  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userId).select('-password')
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not Authorized - Invalid Token')
    }
  } else {
    res.status(401)
    throw new Error('Not Authorized - No Token')
  }
})

//Admin Middleware

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not Authorized as admin')
  }
}

export { protect, admin }
