"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

export function StatCounter({
  value,
  label,
  suffix,
  prefix,
  className,
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const { ref, inView } = useInView({ threshold: 0.4 });

  React.useEffect(() => {
    if (!inView) return;
    const start = 0;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();
    let frame: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.round(start + (end - start) * progress));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div ref={ref} className={cn(className, "flex flex-col gap-1")}>
      <span className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {prefix}
        {displayValue.toLocaleString("id-ID")}
        {suffix}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
