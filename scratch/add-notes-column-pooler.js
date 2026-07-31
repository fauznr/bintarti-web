const { Client } = require("pg");

const connectionString = "postgres://postgres.eehktxhhpsdffpwlxghm:Rafimn21041999.@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

async function main() {
  console.log("Connecting to Supabase PostgreSQL via US East Pooler...");
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Successfully connected to PostgreSQL!");
    
    console.log("Altering 'invitations' table to add 'notes' column if it does not exist...");
    await client.query("ALTER TABLE invitations ADD COLUMN IF NOT EXISTS notes TEXT;");
    console.log("Column 'notes' added successfully or already exists!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

main();
