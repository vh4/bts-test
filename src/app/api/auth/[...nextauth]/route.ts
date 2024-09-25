import { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Extend the default User type from NextAuth to include custom fields
interface CustomUser extends User {
  token: string;
  username: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
        password: { label: "password", type: "password", placeholder: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        const data = {
          username: credentials?.username,
          password: credentials?.password,
        };

        try {
          const url = 'http://94.74.86.174:8080/api/login';
          const res = await axios.post(url, data);

          if (res?.data?.statusCode === 2110) {
            const userData = res?.data?.data;
            console.log(userData);

            return {
              ...userData,
              token: userData.token,
              username: data.username,
            };
          } else {
            console.error('Authorization failed:', res.data);
            return null;
          }
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Merge the user object into the token if it exists
      if (user) {
        const customUser = user as CustomUser; // Explicitly type-cast the user to CustomUser
        return {
          ...token,
          accessToken: customUser.token,
          username: customUser.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Type the session.user to CustomUser instead of using any
      session.user = token as unknown as CustomUser;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export the NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
