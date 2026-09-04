import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function transactionsRoutes(app: FastifyInstance) {
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