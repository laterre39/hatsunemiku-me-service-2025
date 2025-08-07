import { MessageCircleWarning } from 'lucide-react';

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <div className={`group relative -translate-y-3`}>
      <MessageCircleWarning size={20}/>
      <div className="absolute left-full top-1/2 z-10 ml-4 -translate-y-1/2 opacity-0 pointer-events-none rounded-lg bg-white px-3 py-2 text-sm font-medium text-black transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto whitespace-nowrap">
        <div className="absolute -left-1 top-1/2 h-0 w-0 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white"></div>
        {text}
      </div>
    </div>
  );
}
