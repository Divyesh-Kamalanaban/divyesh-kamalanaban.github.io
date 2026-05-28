export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category?: 'ai' | 'infra' | 'data' | 'system';
  image?: string;
  icon?: string;
  link?: string;
  version?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  role: string;
  description: string;
  bulletPoints?: string[];
}

export interface SkillCategory {
  title: string;
  bulletColor: string;
  borderColor: string;
  skills: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  bgColor: string;
  textColor: string;
}
