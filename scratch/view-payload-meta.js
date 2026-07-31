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
    
    // Get the latest successful webhook log
    const res = await client.query(`
      SELECT payload 
      FROM webhook_logs 
      WHERE status = 'success' 
      ORDER BY created_at DESC 
      LIMIT 1;
    `);

    if (res.rows.length > 0) {
      const payload = res.rows[0].payload;
      console.log("=== LATEST SUCCESSFUL PAYLOAD ===");
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.log("No successful webhook logs found.");
    }

  } catch (error) {
    console.error("Query failed:", error);
  } finally {
    await client.end();
  }
}

main();
