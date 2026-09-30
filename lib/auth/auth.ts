import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { findOrCreateGoogleUser, googleConfigured, userForEmail } from "@/lib/auth/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  // Și erorile (de ex. Google refuzat) se întorc pe pagina de autentificare, cu ?error=.
  pages: { signIn: "/autentificare", error: "/autentificare" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Parolă", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
        // Contul creat cu Google n-are parolă: intră doar prin Google.
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    // „Continuă cu Google”, doar când e configurat (altfel butonul nu apare).
    // Callback: <NEXT_PUBLIC_APP_URL>/api/auth/callback/google. Doar openid email profile;
    // state + PKCE în cookie-uri HttpOnly, SameSite=Lax, 15 minute (implicit în Auth.js).
    ...(googleConfigured()
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            checks: ["pkce", "state"],
            authorization: { params: { scope: "openid email profile", prompt: "select_account" } },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true;
      // Doar adrese confirmate de Google; altfel cineva ar putea prelua un cont cu parolă.
      if (!profile?.email || profile.email_verified !== true) return false;
      const name = typeof profile.name === "string" && profile.name.trim() ? profile.name.trim() : null;
      const id = await findOrCreateGoogleUser({ email: profile.email, name });
      return Boolean(id);
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && token.email) {
        // Id-ul din JWT e cel din baza noastră, nu „sub”-ul de la Google.
        const dbUser = await userForEmail(token.email);
        if (!dbUser) throw new Error("Contul Google nu a fost găsit după creare.");
        token.id = dbUser.id;
        token.sub = dbUser.id;
        token.email = dbUser.email;
        token.name = dbUser.name;
        // Poza de profil Google nu o folosim și nu o ținem în cookie.
        delete token.picture;
        return token;
      }
      if (user) token.id = user.id as string;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
