interface JobDot {
  pointColor: string;
  shadowColor: string;
}

interface ExperienceTimelineDotProps {
  job: JobDot;
  isExpanded: boolean;
}

export default function ExperienceTimelineDot({ job, isExpanded }: ExperienceTimelineDotProps) {
  return (
    <div
      className={`absolute left-4 top-8 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all ${job.pointColor} ${job.shadowColor} ${
        isExpanded ? 'scale-150' : 'group-hover:scale-125'
      }`}
    />
  );
}