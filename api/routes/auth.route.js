import express from 'express'
import {
  google,
  signup,
  signin,
  authMiddleware,
} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', google)
router.get('/check-auth', authMiddleware, (req, res) => {
  const user = req.user
  res.status(200).json({
    success: true,
    message: 'Authenticated user!',
    user,
  })
})

export default router
