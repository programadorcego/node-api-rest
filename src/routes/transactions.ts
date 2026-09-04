import { FastifyInstance } from "fastify";

export async function transactionsRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        app.get("/", async (request, reply) => {
        return reply.send("hello");
    });
}