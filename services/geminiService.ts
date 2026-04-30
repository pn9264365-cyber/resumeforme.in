import { GoogleGenAI } from "@google/genai";
import { ResumeData } from "../types";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });
const modelId = "gemini-1.5-flash";

export const generateSummary = async (currentData: ResumeData): Promise<string> => {
    if (!apiKey) throw new Error("API Key missing");

    const prompt = `
    Based on the following resume data, write a professional, compelling summary (approx 3-4 sentences) suitable for the top of a resume.
    Focus on career highlights, years of experience, and key skills.
    
    Data:
    Name: ${currentData.personalInfo.fullName}
    Job History: ${currentData.experience.map(e => `${e.position} at ${e.company}`).join(', ')}
    Skills: ${currentData.skills.map(s => s.name).join(', ')}
    
    Return ONLY the summary text. No markup, no conversational filler.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
};

export const enhanceJobDescription = async (position: string, company: string, roughNotes: string): Promise<string> => {
    if (!apiKey) throw new Error("API Key missing");

    const prompt = `
    I need to improve the job description for a resume.
    Role: ${position} at ${company}
    My rough notes/bullets: "${roughNotes}"
    
    Please rewrite this into 3-5 professional, punchy bullet points. 
    Use strong action verbs. Quantify results where possible based on the context (or leave placeholders like [X]%).
    Return the result as a raw text list of bullet points (starting with •). Do not include markdown formatting like **bold**.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
};

export const suggestSkills = async (position: string): Promise<string[]> => {
    if (!apiKey) throw new Error("API Key missing");

    const prompt = `
    Suggest 10 distinct, relevant technical and soft skills for a professional with the job title: "${position}".
    Return the result as a JSON array of strings. Example: ["Skill 1", "Skill 2"].
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Error:", error);
        return [];
    }
};

export const parseResumeFromText = async (text: string): Promise<ResumeData> => {
    if (!apiKey) throw new Error("API Key missing");

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
            {
                "id": "string",
                "company": "string",
                "position": "string",
                "startDate": "string",
                "endDate": "string",
                "current": boolean,
                "description": "bullet points separated by newlines"
            }
        ],
        "education": [
            {
                "id": "string",
                "institution": "string",
                "degree": "string",
                "fieldOfStudy": "string",
                "startDate": "string",
                "endDate": "string",
                "current": boolean
            }
        ],
        "skills": [
            {
                "id": "string",
                "name": "string",
                "category": "string",
                "level": "Beginner" | "Intermediate" | "Expert"
            }
        ],
        "certifications": ["string"],
        "projects": [
            {
                "id": "string",
                "name": "string",
                "description": "string",
                "technologies": "string"
            }
        ]
    }

    Raw Resume Text:
    ---
    ${text.substring(0, 15000)}
    ---

    Return ONLY the valid JSON object. Do not include markdown formatting or any other text.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const responseText = response.text?.trim() || "{}";
        // Remove markdown code blocks if present (though responseMimeType should prevent them)
        const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanJson) as ResumeData;
    } catch (error) {
        console.error("Gemini Parsing Error:", error);
        throw error;
    }
};
