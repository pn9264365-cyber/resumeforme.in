import { ResumeData } from "../types";

export const generateSummary = async (currentData: ResumeData): Promise<string> => {
    try {
        const response = await fetch("/api/ai/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: currentData }),
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.details || err.error || "AI Summary failed");
        }
        const result = await response.json();
        return result.text;
    } catch (error) {
        console.error("Gemini Service Error:", error);
        throw error;
    }
};

export const enhanceJobDescription = async (position: string, company: string, roughNotes: string): Promise<string> => {
    try {
        const response = await fetch("/api/ai/enhance-description", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position, company, roughNotes }),
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.details || err.error || "AI Enhancement failed");
        }
        const result = await response.json();
        return result.text;
    } catch (error) {
        console.error("Gemini Service Error:", error);
        throw error;
    }
};

export const suggestSkills = async (position: string): Promise<string[]> => {
    try {
        const response = await fetch("/api/ai/suggest-skills", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position }),
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.details || err.error || "AI Skill Suggestion failed");
        }
        const result = await response.json();
        return result.skills;
    } catch (error) {
        console.error("Gemini Service Error:", error);
        return [];
    }
};

export const parseResumeFromText = async (text: string): Promise<ResumeData> => {
    try {
        const response = await fetch("/api/ai/parse-resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.details || err.error || "AI Parsing failed");
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Gemini Service Error:", error);
        throw error;
    }
};
