import { Suspense } from "react";
import Starfield from "@/components/Starfield";
import LoginForm from "@/components/auth/LoginForm";

export default function AutentificarePage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <Starfield count={70} />
      <div className="relative z-10 flex w-full flex-col items-center">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
