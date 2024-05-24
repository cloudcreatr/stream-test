import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  out: "migrations",
  schema: "schema/form.ts",
});