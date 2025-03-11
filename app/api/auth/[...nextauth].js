import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password");
        }
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});
