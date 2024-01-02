import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXT_PUBLIC_GRAPHQL_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_SPEC_GRAPHQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NEXT_PUBLIC_INFURA_ID: z.string(),
    NEXT_PUBLIC_ALCHEMY_ID: z.string(),
    NEXT_PUBLIC_PROJECT_ID: z.string(),
    NEXT_PUBLIC_PINATA_JWT: z.string(),
    NEXT_PUBLIC_IPFS_WRITE_GATEWAY: z.string().url(),
    NEXT_PUBLIC_IPFS_READ_GATEWAY: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_PINATA_JWT: process.env.NEXT_PUBLIC_PINATA_JWT,
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    NEXT_PUBLIC_IPFS_READ_GATEWAY: process.env.NEXT_PUBLIC_IPFS_READ_GATEWAY,
    NEXT_PUBLIC_IPFS_WRITE_GATEWAY: process.env.NEXT_PUBLIC_IPFS_WRITE_GATEWAY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
