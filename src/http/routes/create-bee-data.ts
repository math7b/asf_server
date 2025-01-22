import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { BeeData, pubSub } from "../../utils/pub-sub";
import { verifyToken } from "../token";

export async function createBeeData(app: FastifyInstance) {
    app.post('/bee/data', async (request, reply) => {
        const createBeeData = z.object({
            content: z.string(),
            beeId: z.string(),
            userId: z.string(),
            token: z.string(),
        });
        const { content, beeId, userId, token } = createBeeData.parse(request.body);
        const verifyedToken = verifyToken(token);
        if (!verifyedToken.valid) {
            return reply.status(400).send({ message: "Não altorizado" });
        }
        const beeData: BeeData | null = await prisma.beeData.create({
            data: {
                content: content,
                value: 4,
                updatedBy: {
                    connect: { id: userId }
                },
                bee: {
                    connect: {
                        id: beeId
                    }
                }
            },
            include: {
                updatedBy: true
            }
        })
        if (!beeData) {
            return reply.status(404).send({ message: 'Erro no cadastro' });
        }
        pubSub.publish('beedata', { action: 'create', type: 'beedata', data: { beeData } })
        return reply.status(201).send();
    });
}
