import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { LoggedUser } from "../../utils/pub-sub";
import { decrypt, encrypt } from "../encrypt";
import { generateToken } from "../token";

export async function logon(app: FastifyInstance) {
    app.post('/logon', async (request, reply) => {
        const logon = z.object({
            email: z.string(),
            password: z.string(),
        })
        const { email, password } = logon.parse(request.body)
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        if (!user) {
            return reply.status(400).send({ message: "Email ou senha incorreto" });
        }
        const encryptedPassword = encrypt(password, user.iv)
        const data: LoggedUser | null = await prisma.user.findUnique({
            where: {
                email: email,
                password: encryptedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
                state: true,
                asfCoins: true,
                asfCash: true,
                registeredAt: true,
                beeKeeper: true,
            }
        })
        if (!data) {
            return reply.status(400).send({ message: "Email ou senha incorreto" });
        }
        if (data.beeKeeper) {
            data.beeKeeper = {
                ...data.beeKeeper,
                city: decrypt(data.beeKeeper.city, user.iv),
                phoneNumber: decrypt(data.beeKeeper.phoneNumber, user.iv),
                RG: decrypt(data.beeKeeper.RG, user.iv),
                CPF: decrypt(data.beeKeeper.CPF, user.iv),
            };
        }
        let beeKeeper = false;
        if (data.beeKeeper) {
            beeKeeper = true;
        }
        const newToken = generateToken(user.id, user.name, user.email, user.state, beeKeeper);
        return reply.status(201).send({
            Data: data,
            Token: newToken
        });
    })
}