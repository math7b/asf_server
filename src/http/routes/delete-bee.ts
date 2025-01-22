import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../token";
import { pubSub } from "../../utils/pub-sub";

export async function deleteBee(app: FastifyInstance) {
    app.delete('/bee/:beeId', async (request, reply) => {
        const zBeeId = z.object({
            beeId: z.string(),
        });
        const zBeeBody = z.object({
            userId: z.string(),
            token: z.string(),
        });
        const { beeId } = zBeeId.parse(request.params);
        const { userId, token } = zBeeBody.parse(request.query);
        const verifiedToken = verifyToken(token);
        if (!verifiedToken.valid) {
            return reply.status(400).send({ message: "Não autorizado" });
        }
        if (!beeId) {
            return reply.status(400).send({ message: "Id da abelha não encontrado" });
        }
        try {
            await prisma.beeData.deleteMany({
                where: {
                    beeId: beeId,
                },
            });
            await prisma.bee.delete({
                where: {
                    id: beeId,
                },
            });
            pubSub.publish('beedata', { action: 'delete', type: 'bee', data: { beeId } })
            return reply.status(201).send();
        } catch (error) {
            console.error("Error deleting bee data or bee:", error);
            return reply.status(500).send({ message: "Erro ao excluir a abelha ou seus dados" });
        }
    });
}
