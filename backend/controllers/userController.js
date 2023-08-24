import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc  Auth user & get token
// @route POST api/users/login
// @access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id) //calling generateToken utill function
    res.status(200).json({
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
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User Already Exists')
  }

  const user = await User.create({ name, email, password })

  if (user) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('Invalid Userdata!')
  }
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
  const user = await User.findById(req.user._id)
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found!')
  }
})

// @desc  Update user profile
// @route PUT api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('user not Found')
  }
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
