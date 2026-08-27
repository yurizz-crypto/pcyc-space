import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Adding schedule column...');
  await db.execute(sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS schedule jsonb;`);
  console.log('Adding checklist column...');
  await db.execute(sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS checklist jsonb;`);
  console.log('Done!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
