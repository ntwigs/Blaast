import UserSchema from '../models/UserSchema'
import PostSchema from '../models/PostSchema'
import CommentSchema from '../models/CommentSchema'
import {
  AUTHOR_ID,
  POST_DATA,
} from './constants'

export const getAll = async (limit, offset) =>
  PostSchema.find({}, POST_DATA, { lean: true })
    .sort({ date: -1 })
    .limit(limit)
    .skip(offset * limit)

export const getOne = async _id =>
  PostSchema.findOne({ _id }, POST_DATA, { lean: true })

export const getUsersPost = async (_id, limit, offset) =>
  PostSchema.find({ [AUTHOR_ID]: _id }, POST_DATA, { lean: true })
    .sort({ date: -1 })
    .limit(limit)
    .skip(offset * limit)

export const create = async (ctx) => {
  const { title, body } = ctx.request.body
  const { name, _id } = ctx.state.user
  const user = await UserSchema.findOne({ _id })

  if (!user) {
    ctx.throw(403)
  }

  return new PostSchema({
    title,
    body,
    author: {
      _id,
      name,
    },
  }).save()
}

export const update = async (ctx) => {
  const { _id } = ctx.params
  const authorId = ctx.state.user._id
  const user = await UserSchema.findOne({ _id: authorId })

  if (!user) {
    ctx.throw(403)
  }

  return PostSchema.findOneAndUpdate({ _id, [AUTHOR_ID]: authorId }, ctx.request.body)
}

export const remove = async (ctx) => {
  const { _id } = ctx.params
  const authorId = ctx.state.user._id
  const user = await UserSchema.findOne({ _id: authorId })

  if (!user) {
    ctx.throw(403)
  }

  await PostSchema.findOneAndRemove({ _id, [AUTHOR_ID]: authorId })
  await CommentSchema.remove({ post: _id })
}
