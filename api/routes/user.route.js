import express from 'express'
import {
  deleteUser,
  getUsers,
  test,
  updateUser,
} from '../controllers/user.controller.js'
// import { verifyToken } from '../coderecur-api/utils/verifyUser.js'

const router = express.Router()

router.get('/test', test)
router.put('/update/:userId', updateUser)
router.delete('/delete/:userId', deleteUser)
router.get('/getusers', getUsers)

export default router
