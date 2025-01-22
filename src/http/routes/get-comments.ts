import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getComments(app: FastifyInstance) {
    app.get('/comments', async (request, reply) => {
        const comments = await prisma.comment.findMany({})
        return reply.status(201).send(comments)
    })
}