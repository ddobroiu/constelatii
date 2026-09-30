import { NextResponse, type NextRequest } from "next/server";
import { handlers } from "@/lib/auth/auth";
import { googleConfigured } from "@/lib/auth/google";

/**
 * Întoarcerea de la Google: <NEXT_PUBLIC_APP_URL>/api/auth/callback/google.
 * Ruta fixă are prioritate față de [...nextauth]; fără chei răspunde 404, altfel
 * lasă Auth.js să verifice state + PKCE, să schimbe codul și să valideze id_token-ul
 * (contul e găsit sau creat în callback-ul signIn din lib/auth/auth.ts).
 */
export async function GET(request: NextRequest) {
  if (!googleConfigured()) return new NextResponse(null, { status: 404 });
  return handlers.GET(request);
}
