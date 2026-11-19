import { config } from "dotenv";
import { z } from "zod";

config({
    path: process.env.NODE_ENV === "test"
        ? "./.env.test"
        : "./.env"
});

const envSchema = z.object({
    NODE_ENV: z.enum(["test", "dev", "production"]).default("production"),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error("Invalid enviroment variables", _env.error.format());
    throw new Error("Invalid enviroment variables");
}

export const env = _env.data;