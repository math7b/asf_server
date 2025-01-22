import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getPosts(app: FastifyInstance) {
    app.get('/posts', async (request, reply) => {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
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
        return reply.status(201).send(posts)
    })
}