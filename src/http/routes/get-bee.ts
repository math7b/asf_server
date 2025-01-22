import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getBee(app: FastifyInstance) {
    app.get('/bee', async (request, reply) => {
        const bee = await prisma.bee.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                binomialNomenclature: true,
            }
        })
        return reply.status(201).send(bee)
    })
}