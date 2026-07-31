const { Client } = require("pg");

async function testPort(port) {
  const host = "aws-0-ap-northeast-1.pooler.supabase.com";
  const connectionString = `postgres://postgres.eehktxhhpsdffpwlxghm:Rafimn21041999.@${host}:${port}/postgres`;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });
  
  try {
    console.log(`Attempting to connect to port ${port}...`);
    await client.connect();
    console.log(`Port ${port}: SUCCESS!`);
    await client.end();
  } catch (err) {
    console.log(`Port ${port} failed:`, err.message);
  }
}

async function main() {
  await testPort(5432);
  await testPort(6543);
}

main();
