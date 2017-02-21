import dotenv from 'dotenv'
dotenv.config()
import { compare } from 'bcrypt-as-promised'
import * as auth from '../DAL/auth'
import credentialCheck from './middlewares/auth/checkCredential'
import UserSchema from '../models/UserSchema'
import Router from 'koa-router'
import jwt from 'jsonwebtoken'
const router = new Router()


router
  .post('auth', credentialCheck, async (ctx, next) => {
    const { username, password } = ctx.request.body
    
    try {
      const user = await auth.getUser(username)
      const correctPassword = await compare(password, user.password)
      ctx.status = 200
      ctx.body = {
        token: jwt.sign({ name: username, _id: user._id }, process.env.PUBLIC_SECRET),
        message: 'Logged in'
      }
    } catch(e) {
      ctx.throw('A user with the entered credentials could not be found', 403)
    }
  })

export default router