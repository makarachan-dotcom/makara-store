import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// បើកសិទ្ធិឱ្យ Frontend អាចទាញយកទិន្នន័យបានដោយសុវត្ថិភាព (CORS)
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// បង្កើត Route សម្រាប់ដោះស្រាយបញ្ហាការទាមទារទិន្នន័យផ្ទៀងផ្ទាត់ (Auth Endpoint)
app.post("/api/auth/register", async c => {
  try {
    const body = await c.req.json();
    console.log("📥 Register request received:", body);

    // បោះទិន្នន័យជោគជ័យត្រឡប់ទៅ Frontend វិញជាទម្រង់ JSON ពិតប្រាកដ
    return c.json({
      success: true,
      user: { name: body.name || "User", email: body.email, role: "user" },
    });
  } catch (error) {
    return c.json({ success: false, error: "Invalid JSON input" }, 400);
  }
});

app.post("/api/auth/login", async c => {
  try {
    const body = await c.req.json();
    return c.json({
      success: true,
      token: "mock-jwt-token-for-local-testing",
      user: { email: body.email, role: "user" },
    });
  } catch (error) {
    return c.json({ success: false, error: "Auth failed" }, 400);
  }
});

console.log("🚀 Makara Store Unified Backend successfully booted up!");

export default app;
