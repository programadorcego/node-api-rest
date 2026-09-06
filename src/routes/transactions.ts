import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function transactionsRoutes(app: FastifyInstance) {
    app.get("/", async (request, reply) => {
        const transactions = await prisma.transaction.findMany();

        return reply.send({
            transactions
        });
    });

    app.get("/:id", async (request, reply) => {
        const transactionParamSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = transactionParamSchema.parse(request.params);

        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
            }
        });

        return reply.send({
            transaction
        });
    });

    app.get("/summary", async (request, reply) => {
        const summary = await prisma.transaction.aggregate({
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
            },
        });

        return reply.status(201).send();
    });
}