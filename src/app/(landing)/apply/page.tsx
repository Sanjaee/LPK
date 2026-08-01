import { eq } from "drizzle-orm";
import { db } from "@/db";
import { programs } from "@/db/schema";
import { ApplicantMultiStepForm } from "@/components/applicants/multi-step-form";
import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { auth } from "@/auth";

export const metadata = {
  title: "Daftar sebagai Pekerja Migran",
  description: "Formulir pendaftaran pekerja migran LPK",
};

export default async function ApplicantRegisterPage() {
  const session = await auth();
  const programsList = await db
    .select({ id: programs.id, name: programs.name })
    .from(programs)
    .where(eq(programs.isActive, true));

  return (
    <>
      <Header isLoggedIn={!!session?.user} />
      <main className="flex-1 bg-muted/30 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
          <ApplicantMultiStepForm programs={programsList} />
        </div>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
