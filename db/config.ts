import { column, defineDb, defineTable } from "astro:db";

const Post = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    likes: column.number({ default: 0 }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Post },
});
