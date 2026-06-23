interface StackSkillIconProps {
  slug: string;
  iconUrl: string;
  skillName: string;
}

export default function StackSkillIcon({ slug, iconUrl, skillName }: StackSkillIconProps) {
  if (!slug) {
    return <div className="w-4 h-4 rounded-full bg-white/10" />;
  }

  return (
    <img
      src={iconUrl}
      alt={`${skillName} logo`}
      className="w-4 h-4 object-contain transition-all"
      referrerPolicy="no-referrer"
    />
  );
}