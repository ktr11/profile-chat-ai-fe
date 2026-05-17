import express from "express";
import { createMiddleware } from "@mswjs/http-middleware";
import { handlers } from "../src/test/handlers";

const PORT = Number(process.env.MOCK_PORT ?? 18000);
const app = express();

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(createMiddleware(...handlers));

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
