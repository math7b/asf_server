import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export async function getComment(app: FastifyInstance) {
    app.get('/comment/:commentId', async (request, reply) => {
        const getCommentParams = z.object({
            commentId: z.string().uuid(),
        })
        const { commentId } = getCommentParams.parse(request.params)
        const comments = await prisma.comment.findMany({
            where: {
                id: commentId,
            },
            include: {
                replies: {}
            }
        })
        return reply.status(201).send(comments)
    })
}