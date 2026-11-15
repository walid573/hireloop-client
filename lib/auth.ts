import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db('hireloopdb');

// Used by server actions for direct premium/user lookups
export { db };

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
    enabled: true,
  },
  // The admin plugin OWNS the user `role` field (it declares it with
  // input: false, overriding anything set here — which is why role is NOT
  // in additionalFields). Sign-up can't set role directly; the picked role
  // is applied right after sign-up via setInitialRole (lib/actions/user).
  // Role values: "seeker" | "recruiter" | "admin" — new accounts have no
  // role until setInitialRole runs.
  plugins: [
    admin(),
  ],
  database: mongodbAdapter(db, {
    client,
  }),

});