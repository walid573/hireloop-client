import { betterAuth } from "better-auth";
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
  user: {
    additionalFields: {
      role: {
        // "seeker" | "recruiter" | "admin" — allowed values are enforced by the
        // sign-up form; better-auth additionalFields only type this as a string
        type: "string",
        required: false,
        defaultValue: "seeker",
        input: true, // allow clients to send this during sign-up
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),

});