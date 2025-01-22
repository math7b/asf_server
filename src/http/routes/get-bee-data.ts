import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { BeeData } from "../../utils/pub-sub";

export async function getBeeData(app: FastifyInstance) {
    app.get('/bee/:beeId', async (request, reply) => {
        const getBeeData = z.object({
            beeId: z.string(),
        })
        const { beeId } = getBeeData.parse(request.params)
        const beeData: BeeData | null = await prisma.beeData.findUnique({
            where: {
                beeId: beeId
            },
            include: {
                updatedBy: true,
            }
        })
        if (!beeData) {
            return reply.status(400).send({ message: "Dados da abelha não encontrado" })
        }
        return reply.status(201).send(beeData)
    })
}
