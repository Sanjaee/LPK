"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  id?: string;
}

export function TagInput({ value, onChange, placeholder, id }: TagInputProps) {
  const [input, setInput] = React.useState("");

  const addTag = () => {
    const tag = input.trim().replace(/,+$/, "");
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-destructive"
            aria-label={`Hapus ${tag}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <Input
        id={id}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="h-6 min-w-32 flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
