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

    console.log("=== COLUMNS ===");
    const cols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'invitations';
    `);
    console.log(cols.rows.map(r => `${r.column_name}: ${r.data_type}`).join("\n"));

    console.log("\n=== SAMPLE ROWS ===");
    const rows = await client.query("SELECT id, full_name, link_undangan, link_tamu, type FROM invitations LIMIT 3;");
    console.log(JSON.stringify(rows.rows, null, 2));

  } catch (error) {
    console.error("Query failed:", error);
  } finally {
    await client.end();
  }
}

main();
