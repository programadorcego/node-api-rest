import Fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions";

export const app = Fastify();

app.register(transactionsRoutes, {
    prefix: "transactions"
});