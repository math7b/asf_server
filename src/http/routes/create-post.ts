import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { pubSub } from "../../utils/pub-sub";
import { verifyToken } from "../token";

export async function createPost(app: FastifyInstance) {
    app.post('/post', async (request, reply) => {
        const createPost = z.object({
            title: z.string(),
            content: z.string(),
            option: z.string(),
            state: z.string().optional(),
            userId: z.string(),
            token: z.string(),
        })
        const { title, content, option, state, userId, token } = createPost.parse(request.body)
        const verifyedToken = verifyToken(token);
        if (!verifyedToken.valid) {
            return reply.status(400).send({ message: "Não autorizado" });
        }
        if ((option === "event") && (state === '')) {
            return reply.status(400).send({ message: "Eventos deve estar associado a um estado para fins de divuldação a outros usuarios" })
        }
        const postCreated = await prisma.post.create({
            data: {
                title,
                content,
                option,
                state,
                value: 4,
                user: {
                    connect: {
                        id: userId,
                    }
                }
            }
        })
        const post = await prisma.post.findUnique({
            where: {
                id: postCreated.id
            },
            select: {
                id: true,
                title: true,
                content: true,
                value: true,
                createdAt: true,
                option: true,
                comments: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        state: true,
                        registeredAt: true,
                        beeKeeper: true,
                    }
                }
            }
        });
        if (!post) {
            return reply.status(404).send({ message: "Postagem não encontrada" });
        }
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                asfCoins: {
                    increment: 4
                }
            }
        })
        pubSub.publish('postdetails', { action: 'create', type: 'post', data: { post } })
        pubSub.publish('userdetails', { action: 'create', type: 'post', data: { userId } })
        return reply.status(201).send()
    })
}