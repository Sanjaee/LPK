import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { type Testimonial } from "@/db/schema";

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="flex flex-col rounded-xl border p-6"
        >
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: t.rating ?? 5 }).map((_, i: number) => (
              <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="mb-3 text-sm italic text-muted-foreground">
            <q>{t.quote}</q>
          </blockquote>
          <div className="mt-auto flex items-center gap-3">
            <Avatar size="sm">
              {t.avatar ? (
                <AvatarImage src={t.avatar} alt={t.name} />
              ) : (
                <AvatarFallback>
                  {t.name
                    .split(" ")
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
