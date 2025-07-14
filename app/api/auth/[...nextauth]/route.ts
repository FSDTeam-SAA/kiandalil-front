import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const result = await res.json();

          if (!res.ok) {
            throw new Error(result?.message || "Login failed");
          }

          if (result?.success && result?.data?.accessToken) {
            return {
              id: result.data._id,
              name: result.data.name || credentials.email.split("@")[0],
              email: credentials.email,
              role: result.data.role,
              accessToken: result.data.accessToken,
            };
          }

          return null;
        } catch (err: any) {
          console.error("Auth error", err);
          throw new Error(err.message || "Internal Server Error");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // For credentials login
      if (user && account?.provider === "credentials") {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      // For Google login
      if (account?.provider === "google" && user?.email) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                gLogin: true,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data?.success) {
            token.id = data.data._id;
            token.role = data.data.role;
            token.accessToken = data.data.accessToken;
            token.name = user.name;
            token.email = user.email;
          } else {
            console.error("Google login failed:", data);
          }
        } catch (error) {
          console.error("Error contacting backend during Google login:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
