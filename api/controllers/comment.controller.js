import Comment from '../models/comment.model.js'

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId, username, image } = req.body

    // if (userId !== req.user.id) {
    //   return next(
    //     errorHandler(403, 'You are not allowed to create this comment')
    //   )
    // }

    const newComment = new Comment({
      content,
      postId,
      userId,
      username,
      image,
    })
    await newComment.save()
    res.status(201).json({
      success: true,
      newComment: newComment,
    })
  } catch (error) {
    // next(error)
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    })
    res.status(200).json({
      success: true,
      comments: comments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}
export const getcomments = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.sort === 'desc' ? -1 : 1
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
    const totalComments = await Comment.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })
    res.status(200).json({
      success: true,
      comments: comments,
      totalComments: totalComments,
      lastMonthComments: lastMonthComments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return res.json({
        success: false,
        message: 'Comment not found',
      })
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json({
      success: true,
      message: 'Comment deleted!',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return res.json({
        success: false,
        message: 'Comment not found',
      })
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    )
    res.status(200).json({
      success: true,
      editedComment: editedComment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return res.json({
        success: false,
        message: 'Comment not found',
      })
    }
    const userIndex = comment.likes.indexOf(req.params.userId)
    if (userIndex === -1) {
      comment.numberOfLikes += 1
      comment.likes.push(req.params.userId)
    } else {
      comment.numberOfLikes -= 1
      comment.likes.splice(userIndex, 1)
    }
    await comment.save()
    res.status(201).json({
      success: true,
      comment: comment,
    })
    //     res.status(200).json(comment)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}
