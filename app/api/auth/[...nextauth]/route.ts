import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  getLoginRateLimitKey,
  recordLoginFailure,
} from "@/lib/login-rate-limit";

function getHeaderValue(
  headers: Record<string, string | string[] | undefined> | undefined,
  key: string
) {
  const value = headers?.[key] ?? headers?.[key.toLowerCase()];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getClientIp(headers: Record<string, string | string[] | undefined> | undefined) {
  const forwardedFor = getHeaderValue(headers, "x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return getHeaderValue(headers, "x-real-ip") || "unknown";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please enter your username and password");
        }

        const ipAddress = getClientIp(req?.headers);
        const rateLimitKey = getLoginRateLimitKey(credentials.username, ipAddress);
        const limitState = checkLoginRateLimit(rateLimitKey);

        if (!limitState.allowed) {
          throw new Error(
            `Too many login attempts. Try again in ${Math.ceil(
              limitState.retryAfterSeconds / 60
            )} minute(s).`
          );
        }

        // 1. Find user by 'username' (matching your register logic)
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        // 2. Check if user exists and has a password
        if (!user || !user.password) {
          recordLoginFailure(rateLimitKey);
          throw new Error("No user found with that username");
        }

        // 3. Compare passwords using bcrypt
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          const failureState = recordLoginFailure(rateLimitKey);

          if (failureState.blocked) {
            throw new Error(
              `Too many login attempts. Try again in ${Math.ceil(
                failureState.retryAfterSeconds / 60
              )} minute(s).`
            );
          }

          throw new Error("Invalid password");
        }

        clearLoginFailures(rateLimitKey);

        // 4. Return the user object (this will be passed to the JWT callback)
        return {
          id: user.id.toString(),
          username: user.username,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          gender: user.gender,
          birthdate: user.birthdate.toISOString(),
          avatarUrl: (user as any).avatarUrl,
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
        token.middleName = (user as any).middleName;
        token.lastName = (user as any).lastName;
        token.gender = (user as any).gender;
        token.birthdate = (user as any).birthdate;
        token.avatarUrl = (user as any).avatarUrl;
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
        (session.user as any).middleName = token.middleName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).gender = token.gender;
        (session.user as any).birthdate = token.birthdate;
        (session.user as any).avatarUrl = token.avatarUrl;
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
