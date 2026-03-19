import request from "supertest";
import app from "~/app";

describe("GET /api/status", () => {
  test("check: return HTTP 200", async () => {
    const response = await request(app).get("/api/status");
    expect(response.statusCode).toBe(200);
  });
});
