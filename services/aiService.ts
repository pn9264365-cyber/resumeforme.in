import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSScore, EnhancementSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const modelId = "gemini-1.5-flash";

export async function analyzeATS(data: ResumeData): Promise<ATSScore> {
    if (!process.env.GEMINI_API_KEY) {
        return {
            score: 0,
            detailedScores: { atsCompatibility: 0, keywordMatch: 0, formatting: 0, contentQuality: 0, recruiterAppeal: 0 },
            verdict: 'Needs Improvement',
            feedback: ["AI service not configured. Please add GEMINI_API_KEY."],
            missingKeywords: [],
            topChanges: []
        };
    }

    const prompt = `You are an advanced Professional ATS Resume Analyzer. Evaluate the following resume data against modern recruiter standards and AI-driven ATS algorithms.

    EVALUATION CHECKLIST:
    1. Contact Info: Full Name, Professional Email, Phone, LinkedIn, GitHub/Portfolio, Location.
    2. Formatting: Clean layout, proper headings, no tables/textboxes inside data.
    3. Length: page count vs experience Level.
    4. Summary: Strong, targeted keywords, core strengths.
    5. Skills: Tech/Soft skills overlap with candidate's niche (AI/Quantum/Cyber).
    6. Experience: Bullet points, action verbs, metrics/numbers (CRITICAL).
    7. Projects: Tech stack, impact, strong bullets.
    8. Education: Degree, Institution, Year.
    9. Grammar: Concise writing, professional tone.

    CRITICAL SCORING RULES:
    - Overall Score: Weighted average of sub-scores.
    - BE STRICT: Only perfect resumes get 80+.
    - High Risk Rejection if: missing dates, unclear titles, missing bullet points, no metrics.

    Resume Content: ${JSON.stringify(data)}`;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        detailedScores: {
                            type: Type.OBJECT,
                            properties: {
                                atsCompatibility: { type: Type.NUMBER },
                                keywordMatch: { type: Type.NUMBER },
                                formatting: { type: Type.NUMBER },
                                contentQuality: { type: Type.NUMBER },
                                recruiterAppeal: { type: Type.NUMBER }
                            },
                            required: ["atsCompatibility", "keywordMatch", "formatting", "contentQuality", "recruiterAppeal"]
                        },
                        verdict: { type: Type.STRING, enum: ['Excellent', 'Good', 'Needs Improvement', 'High Risk Rejection'] },
                        feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
                        missingKeywords: { 
                            type: Type.ARRAY, 
                            items: { 
                                type: Type.OBJECT,
                                properties: {
                                    keyword: { type: Type.STRING },
                                    example: { type: Type.STRING }
                                },
                                required: ["keyword", "example"]
                            } 
                        },
                        topChanges: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["score", "detailedScores", "verdict", "feedback", "missingKeywords", "topChanges"]
                }
            }
        });

        const text = response.text || "{}";
        const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanJson) as ATSScore;
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
    if (!process.env.GEMINI_API_KEY) return data;

    const analysisContext = analysis ? `
    ATS AUDIT INSIGHTS TO ADDRESS:
    - Score: ${analysis.score}/100
    - Feedback: ${analysis.feedback.join('; ')}
    - Missing Keywords: ${analysis.missingKeywords.map(k => k.keyword).join(', ')}
    - Top Recommended Changes: ${analysis.topChanges.join('; ')}
    ` : '';

    const prompt = `You are a World-Class Strategic Resume Expert and ATS Optimization Specialist. Your goal is to transform this resume into a top 1% candidate profile that achieves a consistent 90+ score on all modern ATS platforms.
    
    ${analysisContext}

    STRICT GUIDELINES FOR 90+ SCORE:
    1. EXECUTIVE SUMMARY: Replace the current summary with a high-impact 'Executive Summary'. Use strong power words. Focus on ROI and value proposition.
    2. THE XYZ FORMULA: Reword every single experience bullet point to follow the 'XYZ Formula' (Accomplished [X] as measured by [Y], by doing [Z]). If metrics are missing, simulate realistic industry-standard professional metrics (e.g., "boosted efficiency by 22%", "saved $15k/mo").
    3. STRATEGIC KEYWORD INTEGRATION: Integrate the missing keywords naturally into the experience descriptions and skills section.
    4. SKILLS CATEGORIZATION: Organize skills into logical, high-impact categories (e.g., Frontend Architecture, Backend Engineering, Cloud Infrastructure).
    5. IMPACTFUL PROJECTS: Highlight the technical complexity and business impact of each project.
    
    Strictly maintain all original identities (names, companies, degrees, dates). DO NOT CHANGE DATES OR TITLES.
    
    Return the enhanced resume data in the EXACT same JSON structure.
    
    Resume Content: ${JSON.stringify(data).substring(0, 12000)}`;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fullName: { type: Type.STRING },
                        email: { type: Type.STRING },
                        phone: { type: Type.STRING },
                        location: { type: Type.STRING },
                        website: { type: Type.STRING },
                        linkedin: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        experience: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    company: { type: Type.STRING },
                                    position: { type: Type.STRING },
                                    startDate: { type: Type.STRING },
                                    endDate: { type: Type.STRING },
                                    current: { type: Type.BOOLEAN },
                                    description: { type: Type.STRING }
                                },
                                required: ["description"]
                            }
                        },
                        skills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    category: { type: Type.STRING },
                                    level: { type: Type.STRING }
                                }
                            }
                        },
                        projects: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    technologies: { type: Type.STRING },
                                    link: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const text = response.text || "{}";
        const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
        try {
            const enhanced = JSON.parse(cleanJson);
            
            // Merge with original data to preserve non-AI-enhanced fields like education and certifications
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
        } catch (parseError) {
            console.error("JSON Parse Error in Full Enhancement. Response length:", text.length, "Preview:", text.substring(0, 100));
            throw parseError;
        }
    } catch (error) {
        console.error("Full enhancement failed:", error);
        return data;
    }
}

export async function enhanceResume(data: ResumeData): Promise<EnhancementSuggestion[]> {
    if (!process.env.GEMINI_API_KEY) return [];

    const prompt = `Review this resume and suggest enhancements for the personal summary and experience descriptions to be more impactful and professional.
    Return an array of suggestions with original and suggested text.
    Resume Content: ${JSON.stringify(data)}`;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            section: { type: Type.STRING },
                            original: { type: Type.STRING },
                            suggested: { type: Type.STRING },
                            reason: { type: Type.STRING }
                        },
                        required: ["section", "original", "suggested", "reason"]
                    }
                }
            }
        });

        const text = response.text || "[]";
        const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanJson) as EnhancementSuggestion[];
    } catch (error) {
        console.error("Enhancement failed:", error);
        return [];
    }
}

export async function enhanceField(fieldName: string, content: string, context: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) return content;

    const prompt = `You are a Professional Resume Editor. Improve the following ${fieldName} content for better professional impact.
    
    CONTEXT: ${context}
    ORIGINAL CONTENT: "${content}"
    
    GUIDELINES:
    - Use strong action verbs.
    - Be concise and punchy.
    - Quantify results where possible.
    - Match a professional technical tone.
    
    Return ONLY the improved content. No conversational filler or markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt
        });

        return response.text?.trim() || content;
    } catch (error) {
        console.error(`Field enhancement failed for ${fieldName}:`, error);
        return content;
    }
}
