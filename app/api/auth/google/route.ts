import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { signIn } from "@/lib/auth/auth";
import { GOOGLE_REF_COOKIE, googleConfigured } from "@/lib/auth/google";
import { safeRedirect } from "@/lib/auth/redirect";

/**
 * Pornește „Continuă cu Google”: Auth.js pune `state` și PKCE în cookie-uri
 * HttpOnly (SameSite=Lax, 15 minute) și trimite vizitatorul la Google.
 * `?redirect=` — unde revine după (doar cale relativă de pe site); `?ref=` —
 * codul de recomandare de pe „Creează cont”.
 */
export async function GET(request: NextRequest) {
  if (!googleConfigured()) return new NextResponse(null, { status: 404 });

  const params = request.nextUrl.searchParams;
  const redirectTo = safeRedirect(params.get("redirect"));

  const jar = await cookies();
  const ref = params.get("ref");
  if (ref && /^[A-Za-z0-9]{1,32}$/.test(ref)) {
    jar.set(GOOGLE_REF_COOKIE, ref, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 900,
    });
  } else {
    jar.delete(GOOGLE_REF_COOKIE);
  }

  // Aruncă redirecționarea spre Google (NEXT_REDIRECT), cu cookie-urile de mai sus.
  await signIn("google", { redirectTo });
  return new NextResponse(null, { status: 500 });
}
