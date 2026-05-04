import { GoogleGenAI } from "@google/genai";
import { ResumeData } from "../types";

// Initialize AI client lazily
let aiClient: GoogleGenAI | null = null;
const getAI = () => {
    if (!aiClient) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined. Please check your system settings or provide an API key in the environment.");
        }
        aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
};

const MODEL_NAME = "gemini-3-flash-preview";

export const generateSummary = async (currentData: ResumeData): Promise<string> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Based on the following resume data, write a professional, compelling summary (3-4 sentences).
            Name: ${currentData.personalInfo.fullName}
            Skills: ${currentData.skills.map(s => s.name).join(', ')}
            Exp: ${currentData.experience.map(e => `${e.position} at ${e.company}`).join('; ')}
            Return only the summary text.`,
            config: {
                temperature: 0.7,
            }
        });
        
        return response.text.trim();
    } catch (error: any) {
        console.error("AI Summary Error:", error);
        throw error;
    }
};

export const enhanceJobDescription = async (position: string, company: string, roughNotes: string): Promise<string> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Improve this job description bullet points.
            Role: ${position} at ${company}
            Notes: ${roughNotes}
            Return 3-5 high-impact bullet points starting with •. Use action verbs and quantify where possible.`,
            config: {
                temperature: 0.6,
            }
        });
        
        return response.text.trim();
    } catch (error: any) {
        console.error("AI Job Enhancement Error:", error);
        throw error;
    }
};

export const suggestSkills = async (position: string): Promise<string[]> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Suggest 10 relevant technical and soft skills for a "${position}". Return as a JSON array of strings.`,
            config: {
                responseMimeType: "application/json",
                temperature: 0.4,
            }
        });
        
        return JSON.parse(response.text);
    } catch (error: any) {
        console.error("AI Skill Suggestion Error:", error);
        return [];
    }
};

export const parseResumeFromText = async (text: string): Promise<ResumeData> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Extract all information from this resume text and format it into a valid JSON object matching this schema:
            {
                "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": "" },
                "summary": "",
                "experience": [ { "id": "uuid", "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "current": boolean, "description": "bullet points" } ],
                "education": [ { "id": "uuid", "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "" } ],
                "skills": [ { "id": "uuid", "name": "", "level": "Expert" } ],
                "projects": [ { "id": "uuid", "name": "", "description": "" } ],
                "certifications": [ { "id": "uuid", "name": "", "issuer": "", "date": "" } ]
            }
            Resume Text: ${text}`,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        return JSON.parse(response.text);
    } catch (error: any) {
        console.error("AI Parsing Error:", error);
        throw error;
    }
};
