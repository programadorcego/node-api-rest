import { prisma } from "@/lib/prisma";
import { checkSessionIdExists } from "@/middlewares/check-session-id-exists";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function transactionsRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request) => {
console.log(`Method: ${request.method} URL: ${request.url}`);
    });

    app.get("/", { preHandler: checkSessionIdExists }, async (request, reply) => {
        const sessionId = request.cookies.sessionId;

        const transactions = await prisma.transaction.findMany({
            where: {
                sessionId,
            },
        });

        return reply.send({
            transactions
        });
    });

    app.get("/:id", { preHandler: checkSessionIdExists }, async (request, reply) => {
        const transactionParamSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = transactionParamSchema.parse(request.params);

        const sessionId = request.cookies.sessionId;

        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                sessionId,
            }
        });

        return reply.send({
            transaction
        });
    });

    app.get("/summary", { preHandler: checkSessionIdExists }, async (request, reply) => {
        const sessionId = request.cookies.sessionId;

        const summary = await prisma.transaction.aggregate({
            where: {
                sessionId,
            },

            _sum: {
                amount: true,
            }
        });

        const amount = summary._sum;

        return reply.send({
            summary: amount
        });
    });

    app.post("/", async (request, reply) => {
        let sessionId = request.cookies.sessionId;

        if (!sessionId) {
            sessionId = randomUUID();

            reply.setCookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7 // Duração do cookie de 7 dias em segundos
            });
        }

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"]),
        });

        const { title, amount, type } = createTransactionBodySchema.parse(request.body);

        const transaction = await prisma.transaction.create({
            data: {
                title,
                amount: type === "credit" ? amount : amount * -1,
                sessionId,
            },
        });

        return reply.status(201).send();
    });
}