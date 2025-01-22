import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { BeeData, pubSub } from "../../utils/pub-sub";

export async function updateBee(app: FastifyInstance) {
    app.put('/bee/:beeId', async (request, reply) => {
        const zBeeDataId = z.object({
            beeDataId: z.string(),
        });
        const updateBeeSchema = z.object({
            content: z.string().optional(),
            value: z.number().optional(),
            userId: z.string(),
        });
        const { content, value, userId } = updateBeeSchema.parse(request.body);
        const { beeDataId } = zBeeDataId.parse(request.params);

        // Update the type to allow null
        const beeData: BeeData | null = await prisma.beeData.findUnique({
            where: { id: beeDataId },
            include: {
                updatedBy: true,
            },
        });

        if (!beeData) {
            return reply.status(404).send({ message: 'Dados da abelha não encontrado' });
        }

        const updatedBeeData = await prisma.beeData.update({
            where: { id: beeDataId },
            data: {
                content: content,
                value: value,
                updatedBy: {
                    connect: { id: userId },
                },
            },
            include: {
                updatedBy: true,
            },
        });

        pubSub.publish('beedata', { action: 'update', type: 'beedata', data: { updatedBeeData } });
        return reply.status(200).send({ updatedBeeData });
    });
}
