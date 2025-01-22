import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import { fastify } from 'fastify'

import { cherishComment } from './routes/cherish-comment'
import { cherishPost } from './routes/cherish-post'
import { createBee } from './routes/create-bee'
import { createBeeData } from './routes/create-bee-data'
import { createBeeKeeper } from './routes/create-beeKeeper'
import { createComment } from './routes/create-comment'
import { createPost } from './routes/create-post'
import { createSubComment } from './routes/create-subcomment'
import { createUser } from './routes/create-user'
import { deleteBee } from './routes/delete-bee'
import { deleteComment } from './routes/delete-comment'
import { deletePost } from './routes/delete-post'
import { depreciateComment } from './routes/depreciate-comment'
import { depreciatePost } from './routes/depreciate-post'
import { getBee } from './routes/get-bee'
import { getBeeData } from './routes/get-bee-data'
import { getComment } from './routes/get-comment'
import { getComments } from './routes/get-comments'
import { getPost } from './routes/get-post'
import { getPosts } from './routes/get-posts'
import { getUser } from './routes/get-user'
import { updateBee } from './routes/update-bee-data'
import { logon } from './routes/user-logon'
import { postRoutes } from './ws/posts-real-time'

const app = fastify()
app.register(websocket)
app.register(cors)

app.register(cherishComment)
app.register(cherishPost)
app.register(createBeeData)
app.register(createBee)
app.register(createBeeKeeper)
app.register(createComment)
app.register(createPost)
app.register(createSubComment)
app.register(createUser)
app.register(deleteBee)
app.register(deleteComment)
app.register(deletePost)
app.register(depreciateComment)
app.register(depreciatePost)
app.register(getBeeData)
app.register(getBee)
app.register(getComment)
app.register(getComments)
app.register(getPost)
app.register(getPosts)
app.register(getUser)
app.register(updateBee)
app.register(logon)

app.register(postRoutes)

const port = 3333;
app.listen({ host: '0.0.0.0', port: port }).then(() => {
    console.log({ Message: 'HTTP Server running!', Port: port })
})
