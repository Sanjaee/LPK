"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { contactMessageSchema } from "@/lib/validations";

type ContactFormValues = z.infer<typeof contactMessageSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactMessageSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal mengirim");

      toast.success("Pesan terkirim", {
        description: "Kami akan menghubungi Anda segerga ya.",
      });
      reset();
    } catch (err) {
      toast.error("Gagal mengirim", {
        description: (err as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <Field>
        <FieldLabel>Nama *</FieldLabel>
        <FieldContent>
          <Input
            placeholder="Nama lengkap"
            required
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
          />
          <FieldError errors={errors.name ? [errors.name] : []} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Email *</FieldLabel>
          <FieldContent>
            <Input
              type="email"
              placeholder="nama@email.com"
              required
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
            <FieldError errors={errors.email ? [errors.email] : []} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Telepon</FieldLabel>
          <FieldContent>
            <Input type="tel" placeholder="+62 8..." {...register("phone")} />
            <FieldError errors={!!errors.phone ? [errors.phone] : []} />
          </FieldContent>
        </Field>
      </div>

      <Field>
          <FieldLabel>Subjek *</FieldLabel>
          <FieldContent>
            <Input placeholder="Subjek pesan" required {...register("subject")} />
            <FieldError errors={errors.subject ? [errors.subject] : []} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Pesan *</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Tulis pesan Anda di sini..."
            rows={5}
            required
            {...register("message")}
            aria-invalid={errors.message ? "true" : "false"}
          />
          <FieldError errors={errors.message ? [errors.message] : []} />
        </FieldContent>
      </Field>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}
