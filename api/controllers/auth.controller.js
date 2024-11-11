import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
// import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    // next(errorHandler(400, 'All fields are required'))
    return res.json({
      success: false,
      message: 'All fields are required!',
    })
  }

  //* check if password length is less than 8
  if (password.length < 8) {
    return res.json({
      success: false,
      message: 'Password must be at least 8 characters!',
    })
  }

  //* check if user exists
  const checkUser = await User.findOne({ email })
  if (checkUser) {
    // next(errorHandler(400, 'Email already exists'))
    return res.json({
      success: false,
      message: 'Email already exists!',
    })
  }

  //* check if username exists
  const checkUserName = await User.findOne({ username })
  if (checkUserName) {
    // next(errorHandler(400, 'Username already exists!'))
    return res.json({
      success: false,
      message: 'Username already exists!',
    })
  }

  const hashedPassword = bcryptjs.hashSync(password, 10)

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  })

  try {
    await newUser.save()
    // res.status(201).json('Signup successful')
    res.status(200).json({
      success: true,
      message: 'Signup successful, Please Login',
    })
  } catch (error) {
    // next(error)
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password || email === '' || password === '') {
    // next(errorHandler(400, 'All fields are required'))
    return res.json({
      success: false,
      message: 'All fields are required!',
    })
  }

  try {
    const validUser = await User.findOne({ email })
    if (!validUser) {
      // return next(errorHandler(404, 'User not found'))
      return res.json({
        success: false,
        message: 'User not found!',
      })
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      // return next(errorHandler(400, 'Invalid password'))
      return res.json({
        success: false,
        message: 'Invalid password!',
      })
    }
    const token = jwt.sign(
      {
        id: validUser._id,
        username: validUser.username,
        email: validUser.email,
        isAdmin: validUser.isAdmin,
        profilePicture: validUser.profilePicture,
      },
      process.env.JWT_SECRET
    )

    // const { password: pass, ...user } = validUser._doc
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: validUser._id,
        username: validUser.username,
        email: validUser.email,
        isAdmin: validUser.isAdmin,
        profilePicture: validUser.profilePicture,
      },
    })
  } catch (error) {
    // next(error)
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.json({
      success: false,
      message: 'Unauthorized user',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}

export const google = async (req, res, next) => {
  const { email, name, picture } = req.body
  try {
    const googleUser = await User.findOne({ email })
    if (googleUser) {
      const token = jwt.sign(
        {
          id: googleUser._id,
          username: googleUser.username,
          email: googleUser.email,
          isAdmin: googleUser.isAdmin,
          profilePicture: googleUser.profilePicture,
        },
        process.env.JWT_SECRET
      )
      // const { password, ...googleUser } = user._doc
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          id: googleUser._id,
          username: googleUser.username,
          email: googleUser.email,
          isAdmin: googleUser.isAdmin,
          profilePicture: googleUser.profilePicture,
        },
      })
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8)
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: picture,
      })
      await newUser.save()
      const token = jwt.sign(
        {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          profilePicture: newUser.profilePicture,
        },
        process.env.JWT_SECRET
      )
      // const { password, ...newGoogleUser } = newUser._doc
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        // user: newGoogleUser,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          profilePicture: newUser.profilePicture,
        },
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
    console.log(error)
  }
}
