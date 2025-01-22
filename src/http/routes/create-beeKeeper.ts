import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { encrypt } from "../encrypt";

export async function createBeeKeeper(app: FastifyInstance) {
    app.post('/beekeeper', async (request, reply) => {
        const createUser = z.object({
            city: z.string(),
            phoneNumber: z.string(),
            RG: z.string(),
            CPF: z.string(),
            userId: z.string(),
        })
        const {
            city, phoneNumber, RG, CPF, userId
        } = createUser.parse(request.body)
        const getIV = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                iv: true,
            }
        })
        if(!getIV){
            return reply.status(400).send({ message: "O usuario não possue uma chave privada" });
        }
        const encryptedCity = encrypt(city, getIV.iv)
        const encryptedPhoneNumber = encrypt(phoneNumber, getIV.iv)
        const encryptedRG = encrypt(RG, getIV.iv)
        const encryptedCPF = encrypt(CPF, getIV.iv)
        await prisma.beeKeeper.create({
            data: {
                city: encryptedCity,
                phoneNumber: encryptedPhoneNumber,
                RG: encryptedRG,
                CPF: encryptedCPF,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        return reply.status(201).send()
    })
}