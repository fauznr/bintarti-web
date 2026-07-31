const { Client } = require("pg");

const connectionString = "postgres://postgres:Rafimn21041999.@db.eehktxhhpsdffpwlxghm.supabase.co:5432/postgres";

async function main() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database!");

    console.log("Running migration to add expiry_date column...");
    await client.query("ALTER TABLE invitations ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE;");
    console.log("Migration completed successfully!");

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

main();
