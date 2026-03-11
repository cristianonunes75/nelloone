import { Info, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiscernirInfoNoticeProps {
  children: React.ReactNode;
  variant?: 'info' | 'locked';
  className?: string;
}

export function DiscernirInfoNotice({
  children,
  variant = 'info',
  className,
}: DiscernirInfoNoticeProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg p-3 text-xs leading-relaxed',
        variant === 'info'
          ? 'bg-amber-50 border border-amber-200/60 text-amber-700 italic'
          : 'bg-muted/60 border border-border text-muted-foreground',
        className
      )}
    >
      {variant === 'locked' ? (
        <Lock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      ) : (
        <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}
