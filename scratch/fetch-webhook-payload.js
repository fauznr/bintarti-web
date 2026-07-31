const https = require("https");

https.get("https://bintarti.store/api/webhook/comments", (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      if (json.length > 0) {
        // Find the first item with status success
        const item = json.find(i => i.status === "success");
        if (item) {
          console.log("=== SUCCESS WEBHOOK PAYLOAD ===");
          console.log(JSON.stringify(item.payload, null, 2));
        } else {
          console.log("No successful item found, printing first item:");
          console.log(JSON.stringify(json[0].payload, null, 2));
        }
      } else {
        console.log("No logs available.");
      }
    } catch (e) {
      console.log("Failed to parse JSON:", data);
    }
  });
}).on("error", (err) => {
  console.error("HTTP GET failed:", err.message);
});
