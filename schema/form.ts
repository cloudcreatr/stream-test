import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const FormEntry = sqliteTable("formdata", {
  name: text("name"),
  id: integer("id").primaryKey(),
  message: text("message"),
});
