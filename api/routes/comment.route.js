import express from 'express'
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getcomments,
  likeComment,
} from '../controllers/comment.controller.js'

const router = express.Router()

router.post('/create', createComment)
router.get('/getPostComments/:postId', getPostComments)
// router.put('/likeComment/:commentId', verifyToken, likeComment)
router.put('/likeComment/:commentId/:userId', likeComment)
router.put('/editComment/:commentId', editComment)
router.delete('/deleteComment/:commentId', deleteComment)
router.get('/getcomments', getcomments)

export default router
