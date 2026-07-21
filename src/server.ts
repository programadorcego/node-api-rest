import Fastify from "fastify";

const app = Fastify();

app.get("/", (request, reply) => {
    return reply.send({ message: "olá" });
});

app.listen({ port: 3000 }, () => {
    console.log(`Server running`);
});