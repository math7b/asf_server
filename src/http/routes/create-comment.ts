import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { pubSub } from "../../utils/pub-sub";
import { verifyToken } from "../token";

export async function createComment(app: FastifyInstance) {
    app.post('/comment', async (request, reply) => {
        const createCommentBody = z.object({
            content: z.string(),
            postId: z.string(),
            userId: z.string(),
            token: z.string(),
        })
        const { content, postId, userId, token } = createCommentBody.parse(request.body)
        const verifyedToken = verifyToken(token);
        if (verifyedToken.valid == false) {
            return reply.status(400).send({ message: "Não autorizado" });
        }
        const commentCreated = await prisma.comment.create({
            data: {
                content,
                value: 2,
                post: {
                    connect: {
                        id: postId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    }
                }
            }
        })
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentCreated.id,
            },
            select: {
                id: true,
                content: true,
                value: true,
                createdAt: true,
                postId: true,
                replies: true,
                parentCommentId: true,
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
        })
        if (!comment) {
            return reply.status(404).send({ message: "Commentario não encontrado" });
        }
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                asfCoins: {
                    increment: 2
                }
            }
        })
        pubSub.publish('postdetails', { action: 'create', type: 'comment', data: { comment } })
        pubSub.publish('userdetails', { action: 'create', type: 'comment', data: { userId } })
        return reply.status(201).send()
    })
}