import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { pubSub } from "../../utils/pub-sub";
import { verifyToken } from "../token";

export async function deletePost(app: FastifyInstance) {
    app.delete('/post/:postId', async (request, reply) => {
        const zPostId = z.object({
            postId: z.string(),
        })
        const zPostBody = z.object({
            userId: z.string(),
            token: z.string(),
        })
        const { postId } = zPostId.parse(request.params)
        const { userId, token } = zPostBody.parse(request.query)
        const verifiedToken = verifyToken(token);
        if (!verifiedToken.valid) {
            return reply.status(400).send({ message: "Não autorozado" });
        }
        if (!postId) {
            return reply.status(400).send({ message: "Erro carregando as postagens" });
        }
        const getPostCreatorId = await prisma.post.findFirst({
            where: {
                id: postId,
            },
            select: {
                userId: true,
            }
        })
        if (getPostCreatorId?.userId !== userId) {
            return reply.status(400).send({message: "Apenas o criador da postagem pode deletar"})
        }
        await prisma.comment.deleteMany({
            where: {
                postId: postId,
            }
        })
        await prisma.post.delete({
            where: {
                id: postId,
                userId: userId,
            }
        })
        pubSub.publish('postdetails', { action: 'delete', type: 'post', data: { postId, userId } })
        return reply.status(201).send()
    })
}