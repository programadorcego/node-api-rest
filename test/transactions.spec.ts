import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { execSync } from "node:child_process";

describe("Transaction Routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        execSync("npx prisma migrate reset --force");
    });

    it("should be able to create a transaction", async () => {
        const response = await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit",
            });

        expect(response.statusCode).toBe(201);
    });
});