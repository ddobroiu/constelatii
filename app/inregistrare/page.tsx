import { Suspense } from "react";
import { connection } from "next/server";
import { googleConfigured } from "@/lib/auth/google";
import SignupForm from "@/components/auth/SignupForm";

export default async function InregistrarePage() {
  // Cheile Google sunt variabile de rulare (nu există la build): pagina se randează la cerere.
  await connection();
  const googleEnabled = googleConfigured();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div className="relative z-10 flex w-full flex-col items-center">
        <Suspense fallback={null}>
          <SignupForm googleEnabled={googleEnabled} />
        </Suspense>
      </div>
    </div>
  );
}
