import { Tooltip as FlowbiteTooltip } from 'flowbite-react';
import { MessageCircleWarning } from 'lucide-react';

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <FlowbiteTooltip content={text} placement="right" style="light" className="text-black max-w-60 whitespace-normal">
      <MessageCircleWarning size={20} className="-translate-y-3" />
    </FlowbiteTooltip>
  );
}
