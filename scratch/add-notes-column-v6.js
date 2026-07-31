const { Client } = require("pg");

// Connection string with raw IPv6 address
const connectionString = "postgres://postgres:Rafimn21041999.@[2406:da14:311:1500:48b5:109c:c0e9:5edf]:5432/postgres";

async function main() {
  console.log("Connecting directly to Supabase PostgreSQL IPv6 address...");
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
