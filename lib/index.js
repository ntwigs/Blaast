import Koa from 'koa'
import Router from 'koa-router'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'
import db from './utils/mongo'
import errorHandler from './utils/errorHandler'
import acceptHandler from './utils/acceptHandler'
import auth from './routes/auth'
import entry from './routes/entry'
import user from './routes/user'
import post from './routes/post'
import webhook from './routes/webhook'
import comment from './routes/comment'

const app = new Koa()
const router = new Router()
const PORT = 3000

app.use(cors())
app.use(bodyParser())
app.use(json())
app.use(errorHandler)
app.use(acceptHandler)

router.get('/favicon.ico', async (ctx) => {
  ctx.status = 204
})

router.use(auth.routes())
router.use(webhook.routes())
router.use(comment.routes())
router.use(post.routes())
router.use(user.routes())
router.use(entry.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
