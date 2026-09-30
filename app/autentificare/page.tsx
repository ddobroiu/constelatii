import { Suspense } from "react";
import { connection } from "next/server";
import { googleConfigured } from "@/lib/auth/google";
import LoginForm from "@/components/auth/LoginForm";

export default async function AutentificarePage() {
  // Cheile Google sunt variabile de rulare (nu există la build): pagina se randează la cerere.
  await connection();
  const googleEnabled = googleConfigured();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div className="relative z-10 flex w-full flex-col items-center">
        <Suspense fallback={null}>
          <LoginForm googleEnabled={googleEnabled} />
        </Suspense>
      </div>
    </div>
  );
}
