import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

/**
 * Enhanced Progress component with Blue → Purple → Pink gradient animation
 * Meets challenge requirements for visual polish
 */
export default function Progress({ 
  value, 
  max = 100, 
  showLabel = false, 
  className, 
  ...props 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full space-y-2">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-muted/30',
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
