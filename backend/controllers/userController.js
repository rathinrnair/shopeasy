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
  try {
    const users = await User.find({}).select('-password')
    if (users) {
      res.status(200).json(users)
    } else {
      res.status(404).json({ message: 'No Users Found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// @desc  Get user by id
// @route GET api/users/:id
// @access private/Admin
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error(error)

    res.status(400).json({ error: 'Failed to fetch users' })
  }
})

// @desc  Delete user
// @route DELETE api/users/:id
// @access private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      if (user.isAdmin) {
        res.status(400)
        throw new Error('cannot delete admin User')
      }
      await User.deleteOne({ _id: user._id })
      res.status(200).json({ message: 'User Deleted Sucessfully' })
    } else {
      res.status(404).json({ message: 'User Not Found' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Failed to delete users' })
  }
})

// @desc  Update user by id
// @route PUT api/users/:id
// @access private/admin
const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = Boolean(req.body.isAdmin)
      await user.save()
      res.status(200).json({ message: 'User Data Updated.' })
    } else {
      res.status(2404).json({ message: 'User Not Found.' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Failed to Update User Data' })
  }
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
