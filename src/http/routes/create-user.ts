import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { newEncrypt } from "../encrypt";

export async function createUser(app: FastifyInstance) {
    app.post('/user', async (request, reply) => {
        const createUser = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),
            state: z.string(),
        })
        const { name, email, password, state } = createUser.parse(request.body)
        const {
            encryptedData: encryptedPassword,
            iv
        } = newEncrypt(password)
        
        try {
            await prisma.user.create({
                data: {
                    iv: iv,
                    name,
                    email,
                    password: encryptedPassword,
                    state,
                    asfCoins: 0,
                    asfCash: 0,
                }
            })
            const newUserId = await prisma.user.findUnique({
                where: {
                    email: email,
                    password: encryptedPassword,
                },
                select: {
                    id: true,
                }
            })    
            return reply.status(201).send({
                UserId: newUserId
            })
        } catch (error) {
            return reply.status(500).send(error)
        }
    })
}