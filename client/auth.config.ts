import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import axios from "axios";

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new Error("Invalid input");
        }
        // validatedFields {
        //   success: true,
        //   data: { email: 'a.baocute0204@gmail.com', password: '123123' }
        // }

        // credentials {
        //   email: 'a.baocute0204@gmail.com',
        //   password: '123123',
        //   redirect: 'false',
        //   csrfToken: 'ebde55b0c07688cb0042ba0b5a1de63e4dc4a08004003036e6af0d984cf1cba2',
        //   callbackUrl: 'http://localhost:3000/auth/login'
        // }
        const { email, password } = validatedFields.data;
        try {
          const res = await axios.post(
            `${process.env.BACKEND_URL}/api/auth/login`,
            {
              email: email,
              password: password,
            }
          );
          if (res) {
            return res.data;
          }
          return null;
        } catch (error) {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
