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

    it("should be able to list all transactions", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit",
            });

        const cookies = createTransactionResponse.get("Set-Cookie")!;

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies);

        expect(listTransactionsResponse.statusCode).toBe(200);
        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: "New Transaction",
                amount: "5000"
            })
        ]);
    });

    it("should be able to get a specific transaction", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit",
            });

        const cookies = createTransactionResponse.get("Set-Cookie")!;

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies);
        
        const transactionId = listTransactionsResponse.body.transactions[0].id;

        const transactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set("Cookie", cookies);
        
        expect(transactionResponse.statusCode).toBe(200);
        expect(transactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                id: transactionId,
                title: "New Transaction",
                amount: "5000"
            })
        );
    })
});