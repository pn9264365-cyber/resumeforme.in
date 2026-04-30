import express from "express";
import path from "path";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
const getGenAI = () => {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined in environment variables");
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health check for deployment
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Routes
  app.post("/api/ai/summary", async (req, res) => {
    try {
        const { data } = req.body;
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
        Based on the following resume data, write a professional, compelling summary (approx 3-4 sentences) suitable for the top of a resume.
        Focus on career highlights, years of experience, and key skills.
        
        Data:
        Name: ${data.personalInfo.fullName}
        Job History: ${data.experience.map((e: any) => `${e.position} at ${e.company}`).join(', ')}
        Skills: ${data.skills.map((s: any) => s.name).join(', ')}
        
        Return ONLY the summary text. No markup, no conversational filler.
        `;

        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text().trim() });
    } catch (error: any) {
        console.error("AI Update Error:", error);
        res.status(500).json({ error: "AI Service Error", details: error.message });
    }
  });

  app.post("/api/ai/enhance-description", async (req, res) => {
    try {
        const { position, company, roughNotes } = req.body;
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        I need to improve the job description for a resume.
        Role: ${position} at ${company}
        My rough notes/bullets: "${roughNotes}"
        
        Please rewrite this into 3-5 professional, punchy bullet points. 
        Use strong action verbs. Quantify results where possible based on the context (or leave placeholders like [X]%).
        Return the result as a raw text list of bullet points (starting with •). Do not include markdown formatting like **bold**.
        `;

        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text().trim() });
    } catch (error: any) {
        console.error("AI Enhance Error:", error);
        res.status(500).json({ error: "AI Enhance Error", details: error.message });
    }
  });

  app.post("/api/ai/suggest-skills", async (req, res) => {
    try {
        const { position } = req.body;
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Suggest 10 distinct, relevant technical and soft skills for a professional with the job title: "${position}".
        Return the result as a JSON array of strings. Example: ["Skill 1", "Skill 2"].
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
        
        res.json({ skills: JSON.parse(result.response.text()) });
    } catch (error: any) {
        console.error("AI Skills Suggestion Error:", error);
        res.status(500).json({ error: "AI Skills Error", details: error.message });
    }
  });

  app.post("/api/ai/analyze-ats", async (req, res) => {
    try {
        const { data } = req.body;
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `You are an advanced Professional ATS Resume Analyzer. Evaluate the following resume data against modern recruiter standards and AI-driven ATS algorithms.
        Resume Content: ${JSON.stringify(data)}`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
        res.json(JSON.parse(result.response.text()));
    } catch (error: any) {
        console.error("ATS Analysis AI Error:", error);
        res.status(500).json({ error: "AI ATS Analysis Error", details: error.message });
    }
  });

  app.post("/api/ai/full-enhance", async (req, res) => {
    try {
        const { data, analysis } = req.body;
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const analysisContext = analysis ? `
        ATS AUDIT INSIGHTS TO ADDRESS:
        - Score: ${analysis.score}/100
        - Feedback: ${analysis.feedback.join('; ')}
        - Missing Keywords: ${analysis.missingKeywords.map((k: any) => k.keyword).join(', ')}
        - Top Recommended Changes: ${analysis.topChanges.join('; ')}
        ` : '';

        const prompt = `You are a World-Class Strategic Resume Expert and ATS Optimization Specialist. Transform this resume into a top 1% profile (90+ score).
        ${analysisContext}
        Resume Content: ${JSON.stringify(data).substring(0, 12000)}`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
        res.json(JSON.parse(result.response.text()));
    } catch (error: any) {
        console.error("Full Enhance AI Error:", error);
        res.status(500).json({ error: "AI Full Enhance Error", details: error.message });
    }
  });

  app.post("/api/ai/enhance-resume", async (req, res) => {
    try {
        const { data } = req.body;
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Review this resume and suggest enhancements for summary and experience descriptions.
        Return an array of suggestions with original and suggested text.
        Resume Content: ${JSON.stringify(data)}`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
        res.json(JSON.parse(result.response.text()));
    } catch (error: any) {
        console.error("Enhance Resume AI Error:", error);
        res.status(500).json({ error: "AI Resume Enhancement Error", details: error.message });
    }
  });

  app.post("/api/ai/enhance-field", async (req, res) => {
    try {
        const { fieldName, content, context } = req.body;
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Professional Resume Editor. Improve ${fieldName}.
        CONTEXT: ${context}
        ORIGINAL CONTENT: "${content}"
        Return ONLY the improved content text.`;

        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text().trim() });
    } catch (error: any) {
        console.error("Enhance Field AI Error:", error);
        res.status(500).json({ error: "AI Field Enhance Error", details: error.message });
    }
  });

  app.post("/api/ai/parse-resume", async (req, res) => {
    try {
        const { text } = req.body;
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert resume parser. I will provide you with the raw text of a resume.
        Your task is to extract the information and structure it into a JSON object matching the following schema.
        Ensure that strings are properly escaped and the JSON is valid.

        schema:
        {
            "personalInfo": {
                "fullName": "string",
                "email": "string",
                "phone": "string",
                "location": "string",
                "website": "string",
                "linkedin": "string"
            },
            "summary": "string",
            "experience": [
                { "id": "string", "company": "string", "position": "string", "startDate": "string", "endDate": "string", "current": boolean, "description": "bullet points separated by newlines" }
            ],
            "education": [
                { "id": "string", "institution": "string", "degree": "string", "fieldOfStudy": "string", "startDate": "string", "endDate": "string", "current": boolean }
            ],
            "skills": [
                { "id": "string", "name": "string", "category": "string", "level": "Beginner" | "Intermediate" | "Expert" }
            ],
            "certifications": ["string"],
            "projects": [
                { "id": "string", "name": "string", "description": "string", "technologies": "string" }
            ]
        }

        Raw Resume Text:
        ---
        ${text.substring(0, 15000)}
        ---

        Return ONLY the valid JSON object. Do not include markdown formatting or any other text.
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        res.json({ data: JSON.parse(result.response.text()) });
    } catch (error: any) {
        console.error("AI Parsing Error:", error);
        res.status(500).json({ error: "AI Parsing Error", details: error.message });
    }
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
      const { amount } = req.body;
      if (![29, 49, 99].includes(amount)) {
        return res.status(400).json({ error: "Invalid plan amount" });
      }

      const options = {
        amount: amount * 100, // INR to paise
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
