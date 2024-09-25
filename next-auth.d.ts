import "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
    accessToken?: string;

  }

  interface Session extends DefaultSession {
    user: User;
    expires_in: string;
    error: string;
  }
}