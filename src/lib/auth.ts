import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        // Development/Test mode - allow dummy credentials without DB
        if (process.env.NEXTAUTH_TEST_MODE === "true") {
          const testUsers = [
            { email: "test@example.com", password: "test123", name: "Test User" },
            { email: "demo@example.com", password: "demo123", name: "Demo User" },
          ];

          const testUser = testUsers.find(
            (u) => u.email === credentials.email && u.password === credentials.password
          );

          if (testUser) {
            return {
              id: `test-${testUser.email}`,
              name: testUser.name,
              email: testUser.email,
              image: undefined,
              role: "user",
            };
          }

          throw new Error("Invalid test credentials. Try: test@example.com / test123");
        }

        // Production mode - validate against database
        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("No account found with this email");
        }

        const isPasswordValid = await user.comparePassword(
          credentials.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
