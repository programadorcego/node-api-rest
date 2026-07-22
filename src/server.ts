import Fastify from "fastify";
import { env } from "./env/index.js";

const app = Fastify();

app.get("/", (request, reply) => {
    return reply.send({ message: "olá" });
});

app.listen({ port: env.PORT }, () => {
    console.log(`Server running`);
});