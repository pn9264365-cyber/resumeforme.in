import { ResumeData, ATSScore, EnhancementSuggestion } from "../types";
import { getAuth } from "firebase/auth";

export async function analyzeATS(data: ResumeData): Promise<ATSScore> {
    try {
        const response = await fetch("/api/ai/analyze-ats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.details || err.error || "ATS Analysis failed");
        }
        return await response.json();
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
        const response = await fetch("/api/ai/full-enhance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data, analysis }),
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.details || err.error || "Full Enhancement failed");
        }
        const enhanced = await response.json();
        
        // Merge with original data to preserve non-AI-enhanced fields
        return {
            ...data,
            personalInfo: {
                ...data.personalInfo,
                fullName: enhanced.fullName || data.personalInfo.fullName,
                email: enhanced.email || data.personalInfo.email,
                phone: enhanced.phone || data.personalInfo.phone,
                location: enhanced.location || data.personalInfo.location,
                website: enhanced.website || data.personalInfo.website,
                linkedin: enhanced.linkedin || data.personalInfo.linkedin,
            },
            summary: enhanced.summary || data.summary,
            experience: enhanced.experience || data.experience,
            skills: enhanced.skills || data.skills,
            projects: enhanced.projects || data.projects,
        };
    } catch (error) {
        console.error("Full enhancement failed:", error);
        return data;
    }
}

export async function enhanceResume(data: ResumeData): Promise<EnhancementSuggestion[]> {
    try {
        const response = await fetch("/api/ai/enhance-resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
        });
        
        if (!response.ok) throw new Error("Enhancement failed");
        return await response.json();
    } catch (error) {
        console.error("Enhancement failed:", error);
        return [];
    }
}

export async function enhanceField(fieldName: string, content: string, context: string): Promise<string> {
    try {
        const response = await fetch("/api/ai/enhance-field", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fieldName, content, context }),
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.details || err.error || "Field enhancement failed");
        }
        const result = await response.json();
        return result.text;
    } catch (error) {
        console.error(`Field enhancement failed for ${fieldName}:`, error);
        return content;
    }
}
