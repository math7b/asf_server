import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { pubSub } from "../../utils/pub-sub";
import { verifyToken } from "../token";

export async function depreciatePost(app: FastifyInstance) {
    app.put('/depreciate/post/:postId', async (request, reply) => {
        const zPostId = z.object({
            postId: z.string().uuid(),
        })
        const zPostQuery = z.object({
            userId: z.string(),
            token: z.string(),
        })
        const { postId } = zPostId.parse(request.params)
        const { userId, token } = zPostQuery.parse(request.query)
        const verifyedToken = verifyToken(token);
        if (!verifyedToken.valid) {
            return reply.status(400).send({ message: "Não autorizado" });
        }
        const getPostCreator = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                userId: true
            }
        })
        if (getPostCreator?.userId === userId) {
            return reply.status(400).send({ message: "O criador não pode valorizar a propria postagem." })
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
            return reply.status(400).send({ message: "Apreciação não altorizada, falta moedas." })
        }
        await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                value: {
                    decrement: 1,
                },
            },
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
                id: getPostCreator?.userId
            },
            data: {
                asfCash: {
                    decrement: 1
                }
            }
        })
        pubSub.publish('postdetails', { action: "depreciate", type: "post", data: { postId } })
        pubSub.publish('userdetails', { action: "depreciate", type: "post", data: { userId } })
        return reply.status(201).send();
    })
}