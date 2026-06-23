export interface SkillItem {
  name: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  subTitle: string;
  borderColor: string;
  skills: SkillItem[];
}