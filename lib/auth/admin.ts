import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

/**
 * Acces la /admin: doar conturile ale căror adrese sunt în ADMIN_EMAILS (separate prin virgulă).
 * Fără variabilă, /admin răspunde 404 pentru toți. Adresa se ia din baza de date (contul sesiunii), nu din token.
 * Înregistrarea nu verifică adresa de e-mail, deci contul pentru adresa din ADMIN_EMAILS trebuie să existe
 * (creat de proprietar) înainte de a seta variabila.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Contul de admin logat, sau null (nelogat, variabilă lipsă sau adresă nepermisă). */
export async function getAdmin(): Promise<{ id: string; email: string } | null> {
  const allowed = adminEmails();
  if (allowed.length === 0) return null;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
  if (!user || !allowed.includes(user.email.trim().toLowerCase())) return null;
  return user;
}
