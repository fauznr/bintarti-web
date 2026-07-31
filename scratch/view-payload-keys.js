const https = require("https");

https.get("https://bintarti.store/api/webhook/comments", (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      const item = json.find(i => i.status === "success");
      if (item) {
        const payload = item.payload;
        console.log("=== ROOT KEYS ===");
        console.log(Object.keys(payload));

        console.log("\n=== COMMENT_DATA ===");
        if (payload.comment_data) {
          console.log(payload.comment_data);
        }

        console.log("\n=== COMMENT_META ===");
        if (payload.comment_meta) {
          console.log(JSON.stringify(payload.comment_meta, null, 2));
        }

        console.log("\n=== SEARCHING FOR RSVP/PRESENCE KEYS ===");
        // Search recursively for any key/value matching rsvp or presence
        function searchObj(obj, path = "") {
          for (let key in obj) {
            const val = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            if (key.toLowerCase().includes("rsvp") || key.toLowerCase().includes("hadir") || key.toLowerCase().includes("status") || key.toLowerCase().includes("kehadiran")) {
              console.log(`Found key matching pattern: ${currentPath} =`, val);
            }
            if (val && typeof val === "object") {
              searchObj(val, currentPath);
            } else if (val && typeof val === "string" && (val.toLowerCase().includes("hadir") || val.toLowerCase().includes("tidak"))) {
              console.log(`Found value matching pattern: ${currentPath} =`, val);
            }
          }
        }
        searchObj(payload);

      } else {
        console.log("No successful logs found.");
      }
    } catch (e) {
      console.log("Error parsing JSON:", e.message);
    }
  });
}).on("error", (err) => {
  console.error("HTTP GET failed:", err.message);
});
