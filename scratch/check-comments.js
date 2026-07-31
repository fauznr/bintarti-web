const { Client } = require("pg");

const connectionString = "postgres://postgres:Rafimn21041999.@db.eehktxhhpsdffpwlxghm.supabase.co:5432/postgres";

async function main() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to database!");

    // 1. Check if there are any comments in guest_comments table
    console.log("=== GUEST COMMENTS ===");
    const res = await client.query("SELECT * FROM guest_comments ORDER BY created_at DESC LIMIT 10;");
    console.log(JSON.stringify(res.rows, null, 2));

    // 2. Check details of invitation "aqiqah_sayalindra-egyi"
    console.log("\n=== INVITATION DETAILS ===");
    const invRes = await client.query("SELECT id, full_name, link_undangan, link_tamu FROM invitations WHERE id = 'aqiqah_sayalindra-egyi';");
    console.log(JSON.stringify(invRes.rows, null, 2));

  } catch (error) {
    console.error("Query failed:", error);
  } finally {
    await client.end();
  }
}

main();
