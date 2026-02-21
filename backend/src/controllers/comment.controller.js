import AsyncHandler from "express-async-handler";
import { ApiResponse } from "../util/ApiResponse";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../util/ApiError";

const createComment = AsyncHandler(async (req, res) => {
  const { content, postId, userId } = req.body;

  if (!content || !postId || !userId) return res.status(400).json(new ApiResponse(400, null, "content postId or userId not present"))

  try {
    const comment = await Comment.create({ content, postId, createdBy: userId })
    if (!comment) throw new ApiError(500, "unable to create comment", error)

    return res.status(201).json(new ApiResponse(201, comment, "message created successfully"))
  } catch (error) {
    throw new ApiError(500, "internal server error", error)
  }
})

const replyComment = AsyncHandler(async (req, res) => {
  const { content, commentId, userId } = req.body;

  if (!content || !commentId || !userId) return res.status(400).json(new ApiResponse(400, null, "content postId or userId not present"))

  try {
    const comment = await Comment.findById(commentId)
    if (!comment) throw new ApiError(500, "unable to create comment", error)

    comment.reply.push({ content, createdBy: userId, postId: commentId })
    await comment.save()

    return res.status(201).json(new ApiResponse(201, comment, "message created successfully"))
  } catch (error) {
    throw new ApiError(500, "internal server error", error)
  }
})

const clapComment = AsyncHandler(async (req, res) => {
  const { commentId, userId } = req.body;

  if (!commentId) return res.status(400).json(new ApiResponse(400, null, "commentId not present"))

  try {
    const comment = await Comment.findById(commentId)

    if (!comment) return res.status(404).json(new ApiResponse(404, null, "comment not present"));

    comment.clappedBy.push(userId)
    comment.$inc("clap", (comment.clap || 0) + 1);

    await comment.save()

  } catch (error) {
    throw new ApiError(500, "internal server error", error)
  }
})

const fetchComment = AsyncHandler(async (req, res) => {
  const { postId } = req.body;
  if (!postId) return res.status(400).json(new ApiResponse(400, null, "post id is not present"))
  try {
    const comments = await Comment.find();
    if (!comments) return res.status(404).json(new ApiResponse(404, null, "comments not found"))

    return res.status(200).json(new ApiResponse(200, comments, "comments fetched succesfully"))
  } catch (error) {

  }
})

export {
  clapComment,
  createComment,
  replyComment,
  fetchComment
}