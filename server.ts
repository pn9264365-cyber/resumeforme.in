import express from "express";
import path from "path";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health check for deployment
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Razorpay Initialization
  const cleanKey = (key: string | undefined) => {
    if (!key) return undefined;
    return key.trim().replace(/^["']|["']$/g, '');
  };
  
  // Explicitly use the keys provided in the request to resolve "Authentication failed"
  const razorpayKeyId = "rzp_test_Sjmgef8ZEFIByg";
  const razorpayKeySecret = "O8b4ZEpEQlAGlHfc39ZLMYhk";

  console.log("Razorpay configuration (Hardcoded for Fix):");
  console.log(`- RAZORPAY_KEY_ID: ${razorpayKeyId.substring(0, 10)}... (len: ${razorpayKeyId.length})`);

  const razorpay = new Razorpay({
    key_id: razorpayKeyId || "rzp_test_dummy",
    key_secret: razorpayKeySecret || "dummy_secret",
  });

  // API Routes
  app.post("/api/create-order", async (req, res) => {
    try {
      const options = {
        amount: 900, // INR 9.00 (900 paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error: any) {
      console.error("Razorpay Order Error:", error);
      res.status(500).json({ 
        error: "Order creation failed", 
        details: error.message,
        code: error.code || "UNKNOWN_ERROR"
      });
    }
  });

  app.post("/api/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret || "dummy")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ status: "ok" });
    } else {
      res.status(400).json({ status: "error", message: "Invalid signature" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
