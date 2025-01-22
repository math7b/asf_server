import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { pubSub } from "../../utils/pub-sub";
import { verifyToken } from "../token";

export async function cherishComment(app: FastifyInstance) {
    app.put('/cherish/comment/:commentId', async (request, reply) => {
        const zCommentId = z.object({
            commentId: z.string().uuid(),
        })
        const zCommentQuery = z.object({
            userId: z.string(),
            token: z.string(),
        })
        const { commentId } = zCommentId.parse(request.params)
        const { userId, token } = zCommentQuery.parse(request.query)
        const verifyedToken = verifyToken(token);
        if (!verifyedToken.valid) {
            return reply.status(400).send({ message: "Não autorizado" });
        }
        const getCommentCreator = await prisma.comment.findUnique({
            where: {
                id: commentId
            },
            select: {
                userId: true
            }
        })
        if (getCommentCreator?.userId === userId) {
            return reply.status(400).send({ message: "O criador não pode valorizar a propria postagem" })
        }
        const getASFCoinsOfCheirisherUser = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                asfCoins: true
            }
        })
        if (getASFCoinsOfCheirisherUser === null || getASFCoinsOfCheirisherUser?.asfCoins < 2) {
            return reply.status(400).send({ message: "Apreciação não altorizada, falta moedas" })
        }
        await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                value: {
                    increment: 1
                }
            }
        })
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                asfCoins: {
                    decrement: 2
                }
            }
        })
        await prisma.user.update({
            where: {
                id: getCommentCreator?.userId
            },
            data: {
                asfCash: {
                    increment: 1
                }
            }
        })
        const commentCreator = getCommentCreator?.userId;
        pubSub.publish('postdetails', { action: "cherish", type: "comment", data: { commentId } })
        pubSub.publish('userdetails', { action: "cherish", type: "comment", data: { commentId, userId, commentCreator } })
        return reply.status(201).send();
    })
}