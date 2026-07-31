const { Client } = require("pg");
const dns = require("dns");

const regions = [
  "ap-southeast-1", // Singapore
  "ap-southeast-2", // Sydney
  "ap-southeast-3", // Jakarta
  "ap-northeast-1", // Tokyo
  "ap-northeast-2", // Seoul
  "ap-northeast-3", // Osaka
  "ap-south-1",     // Mumbai
  "us-east-1",      // North Virginia
  "us-east-2",      // Ohio
  "us-west-1",      // Northern California
  "us-west-2",      // Oregon
  "ca-central-1",   // Montreal
  "eu-central-1",   // Frankfurt
  "eu-west-1",      // Ireland
  "eu-west-2",      // London
  "eu-west-3",      // Paris
  "sa-east-1",      // São Paulo
  "ap-south-2",     // Hyderabad
  "eu-south-1",     // Milan
  "me-central-1",   // UAE
  "af-south-1"      // Cape Town
];

async function checkRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  
  // First, resolve host to see if it exists
  return new Promise((resolve) => {
    dns.resolve4(host, async (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        // Doesn't resolve IPv4, skip
        return resolve({ region, status: "dns_failed" });
      }
      
      const connectionString = `postgres://postgres.eehktxhhpsdffpwlxghm:Rafimn21041999.@${host}:6543/postgres`;
      const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
      });
      
      try {
        await client.connect();
        await client.end();
        return resolve({ region, status: "success" });
      } catch (connErr) {
        const msg = connErr.message || "";
        if (msg.includes("tenant/user postgres.eehktxhhpsdffpwlxghm not found")) {
          return resolve({ region, status: "tenant_not_found" });
        } else {
          // If we got another error like auth failed or connection timeout, the tenant IS there!
          return resolve({ region, status: "found", error: msg });
        }
      }
    });
  });
}

async function main() {
  console.log("Probing regions for tenant eehktxhhpsdffpwlxghm...");
  for (const r of regions) {
    const result = await checkRegion(r);
    console.log(`Region: ${r.padEnd(15)} -> ${result.status} ${result.error ? `(${result.error})` : ''}`);
    if (result.status === "success" || result.status === "found") {
      console.log(`\n🎉 MATCH FOUND! Region is: ${r}`);
      break;
    }
  }
}

main();
