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

type SessionUserFields = {
  id?: string;
  utype?: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  gender?: string;
  birthdate?: string;
  username?: string;
};

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
          utype: user.utype, // Carrying over your 'User' or 'Admin' type
        };
      }
    })
  ],
  callbacks: {
    // This adds your custom fields (utype, firstName) to the encrypted Token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const authUser = user as SessionUserFields;
        token.id = user.id;
        token.utype = authUser.utype;
        token.firstName = authUser.firstName;
        token.middleName = authUser.middleName;
        token.lastName = authUser.lastName;
        token.gender = authUser.gender;
        token.birthdate = authUser.birthdate;
        token.username = authUser.username;
      }

      if (trigger === "update" && session?.user) {
        const updatedUser = session.user as SessionUserFields;
        token.firstName = updatedUser.firstName ?? token.firstName;
        token.middleName = updatedUser.middleName ?? token.middleName;
        token.lastName = updatedUser.lastName ?? token.lastName;
        token.gender = updatedUser.gender ?? token.gender;
        token.birthdate = updatedUser.birthdate ?? token.birthdate;
        token.username = updatedUser.username ?? token.username;
        token.utype = updatedUser.utype ?? token.utype;
      }

      return token;
    },
    // This makes those fields accessible in the browser/frontend session
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as SessionUserFields;
        sessionUser.id = typeof token.id === "string" ? token.id : undefined;
        sessionUser.utype = typeof token.utype === "string" ? token.utype : undefined;
        sessionUser.firstName = typeof token.firstName === "string" ? token.firstName : undefined;
        sessionUser.middleName =
          typeof token.middleName === "string" ? token.middleName : null;
        sessionUser.lastName = typeof token.lastName === "string" ? token.lastName : undefined;
        sessionUser.gender = typeof token.gender === "string" ? token.gender : undefined;
        sessionUser.birthdate = typeof token.birthdate === "string" ? token.birthdate : undefined;
        sessionUser.username = typeof token.username === "string" ? token.username : undefined;
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
