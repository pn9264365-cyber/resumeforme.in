import { GoogleGenAI } from "@google/genai";
import { ResumeData, ATSScore, EnhancementSuggestion } from "../types";

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

export async function analyzeATS(data: ResumeData): Promise<ATSScore> {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `You are an elite ATS Specialist. Analyze the following resume data and provide a detailed audit in JSON format.
            {
                "score": 0-100,
                "verdict": "Strong Match" | "Partial Match" | "High Risk Rejection",
                "feedback": ["point 1", "point 2"],
                "missingKeywords": [{ "keyword": "React", "reason": "High demand" }],
                "topChanges": ["Improve summary", "Quantify metrics"],
                "detailedScores": {
                    "atsCompatibility": 0-100,
                    "keywordMatch": 0-100,
                    "formatting": 0-100,
                    "contentQuality": 0-100,
                    "recruiterAppeal": 0-100
                }
            }
            Resume: ${JSON.stringify(data)}`,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        return JSON.parse(response.text);
    } catch (error) {
        console.error("ATS Analysis failed:", error);
        return {
            score: 0,
            detailedScores: { atsCompatibility: 0, keywordMatch: 0, formatting: 0, contentQuality: 0, recruiterAppeal: 0 },
            verdict: 'High Risk Rejection',
            feedback: ["Failed to analyze resume. Please try again later."],
            missingKeywords: [],
            topChanges: []
        };
    }
}

export async function fullEnhanceResume(data: ResumeData, analysis?: ATSScore): Promise<ResumeData> {
    try {
        const ai = getAI();
        const analysisContext = analysis ? JSON.stringify(analysis) : "None";
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Transform this resume into a top 1% profile.
            Guidelines:
            1. Improve every description.
            2. Use industry-specific terminology.
            3. Ensure summary is magnetizing.
            4. Fix formatting inconsistencies.
            
            ATS Analysis Context: ${analysisContext}
            Original Data: ${JSON.stringify(data)}
            
            Return the full updated ResumeData object in JSON format.`,
            config: {
                responseMimeType: "application/json",
                temperature: 0.8,
            }
        });
        
        const enhanced = JSON.parse(response.text);
        
        // Merge with original data to preserve non-AI-enhanced fields
        return {
            ...data,
            personalInfo: {
                ...data.personalInfo,
                fullName: enhanced.personalInfo?.fullName || data.personalInfo.fullName,
                email: enhanced.personalInfo?.email || data.personalInfo.email,
                phone: enhanced.personalInfo?.phone || data.personalInfo.phone,
                location: enhanced.personalInfo?.location || data.personalInfo.location,
                website: enhanced.personalInfo?.website || data.personalInfo.website,
                linkedin: enhanced.personalInfo?.linkedin || data.personalInfo.linkedin,
            },
            summary: enhanced.summary || data.summary,
            experience: enhanced.experience || data.experience,
            skills: enhanced.skills || data.skills,
            projects: enhanced.projects || data.projects,
            certifications: enhanced.certifications || data.certifications,
            education: enhanced.education || data.education,
        };
    } catch (error) {
        console.error("Full enhancement failed:", error);
        return data;
    }
}

export async function enhanceResume(data: ResumeData): Promise<EnhancementSuggestion[]> {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Review this resume and suggest 5 specific enhancements for summary and experience descriptions.
            Return an array of objects: [{ "original": "text", "suggested": "better text", "reason": "why" }]
            Resume: ${JSON.stringify(data)}`,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Enhancement failed:", error);
        return [];
    }
}

export async function enhanceField(fieldName: string, content: string, context: string): Promise<string> {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Professional Resume Editor. Improve ${fieldName}.
            CONTEXT: ${context}
            CONTENT: ${content}
            Return ONLY the improved string.`,
            config: {
                temperature: 0.7,
            }
        });
        
        return response.text.trim();
    } catch (error) {
        console.error(`Field enhancement failed for ${fieldName}:`, error);
        return content;
    }
}
