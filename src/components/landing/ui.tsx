import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  inner = false,
}: React.ComponentProps<"section"> & { id?: string; inner?: boolean }) {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-12 md:py-16 lg:py-20 xl:py-24",
        className
      )}
    >
      <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", inner && "max-w-none px-0")}>
        {children}
      </div>
    </section>
  );
}

export function Container({
  children,
  className,
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  align = "center",
  badge,
}: {
  title: string;
  description?: string;
  align?: "center" | "left";
  badge?: React.ReactNode;
}) {
  const isCenter = align === "center";
  return (
    <div className={cn("mb-10 md:mb-12", isCenter && "text-center")}>
      {badge && <div className="mb-3 flex justify-center">{badge}</div>}
      <h2
        className={cn(
          "font-heading text-2xl font-semibold tracking-tight sm:text-3xl",
          isCenter && "mx-auto max-w-3xl"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 text-sm text-muted-foreground sm:text-base",
            isCenter && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
