interface MarqueeProps {
  text: string;
  reverse?: boolean;
}

export default function Marquee({ text, reverse = false }: MarqueeProps) {
  // Simple component with endless CSS marquee
  const duplicateText = Array(4).fill(text).join(' ');

  return (
    <div className="relative w-full overflow-hidden bg-[#131314] py-5 border-y border-white/5 select-none text-[80px] font-headline font-black text-white/[0.03] uppercase tracking-tighter leading-none">
      <div 
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee 38s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal'
        }}
      >
        <span className="pr-4">{duplicateText}</span>
        <span className="pr-4">{duplicateText}</span>
      </div>
    </div>
  );
}
