import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please enter your username and password");
        }

        // 1. Find user by 'username' (matching your register logic)
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        // 2. Check if user exists and has a password
        if (!user || !user.password) {
          throw new Error("No user found with that username");
        }

        // 3. Compare passwords using bcrypt
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        // 4. Return the user object (this will be passed to the JWT callback)
        return {
          id: user.id.toString(),
          username: user.username,
          firstName: user.firstName,
          utype: user.utype, // Carrying over your 'User' or 'Admin' type
        };
      }
    })
  ],
  callbacks: {
    // This adds your custom fields (utype, firstName) to the encrypted Token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.utype = (user as any).utype;
        token.firstName = (user as any).firstName;
        token.username = (user as any).username;
      }
      return token;
    },
    // This makes those fields accessible in the browser/frontend session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).utype = token.utype;
        (session.user as any).firstName = token.firstName;
        (session.user as any).username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
