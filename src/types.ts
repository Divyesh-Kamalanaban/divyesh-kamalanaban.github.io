export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  category?: 'ai' | 'infra' | 'data' | 'system';
  image?: string;
  icon?: string;
  link?: string;
  version?: string;
  details?: {
    status?: string;
    keyStat?: string;
    mission?: string;
    implementationDetails?: string[];
    keyTakeaways?: string;
  };
}
