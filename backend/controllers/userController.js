import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

// @desc  Auth user & get token
// @route POST api/users/login
// @access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
    //set jwt as http-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, //maxAge is in millisecs so for 30 days
    })
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(401)
    throw new Error('invalid email or password')
  }
})

// @desc  Register new user
// @route POST api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
  res.send('register user')
})

// @desc  Logout user / clear cookies
// @route POST api/users/logout
// @access private
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt').send({ message: 'Logged out sucessfully' })
})

// @desc  Get user profile
// @route GET api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
  res.send('get user profile')
})

// @desc  Update user profile
// @route PUT api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send('update user profile')
})

// @desc  Get users
// @route GET api/users
// @access private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send('get users - admin')
})

// @desc  Get user by id
// @route GET api/users/:id
// @access private/Admin
const getUserById = asyncHandler(async (req, res) => {
  res.send('get user by id - admin')
})

// @desc  Delete user
// @route DELETE api/users/:id
// @access private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send('delete user - admin')
})

// @desc  Update user by id
// @route PUT api/users/:id
// @access private
const updateUser = asyncHandler(async (req, res) => {
  res.send('update user by id')
})

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
