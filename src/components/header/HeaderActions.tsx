import { FileText } from 'lucide-react';

interface HeaderActionsProps {
  onViewResume: () => void;
  resumeLabel: string;
}

export default function HeaderActions({ onViewResume, resumeLabel }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onViewResume}
        className="flex items-center gap-1.5 bg-white text-black hover:bg-primary-fixed hover:text-black hover:shadow-[0_0_15px_rgba(189,255,0,0.4)] px-5 py-2 text-xs uppercase font-extrabold tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
        title="Retrieve Credentials PDF"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>{resumeLabel}</span>
      </button>
    </div>
  );
}