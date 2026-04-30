export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    current: boolean;
}

export interface Skill {
    id: string;
    name: string;
    category?: string;
    level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        linkedin: string;
    };
    summary: string;
    experience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    certifications?: string[];
    projects?: Project[];
    publications?: string[];
    atsScore?: ATSScore;
}

export interface ATSScore {
    score: number;
    detailedScores: {
        atsCompatibility: number;
        keywordMatch: number;
        formatting: number;
        contentQuality: number;
        recruiterAppeal: number;
    };
    verdict: 'Excellent' | 'Good' | 'Needs Improvement' | 'High Risk Rejection';
    feedback: string[];
    missingKeywords: {
        keyword: string;
        example: string;
    }[];
    topChanges: string[];
}

export interface EnhancementSuggestion {
    section: string;
    original: string;
    suggested: string;
    reason: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    link?: string;
    technologies?: string;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    importCount: number;
    optimizeCount: number;
    enhanceCount: number;
    importLimit: number;
    optimizeLimit: number;
    enhanceLimit: number;
    isPremium: boolean;
}

export type TemplateId = 
    | 'modern' 
    | 'classic' 
    | 'minimal' 
    | 'professional' 
    | 'executive' 
    | 'creative' 
    | 'technical' 
    | 'elegant' 
    | 'compact' 
    | 'premium';

export interface TemplateProps {
    data: ResumeData;
}
