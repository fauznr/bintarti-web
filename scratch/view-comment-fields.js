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
        console.log("=== SUCCESS COMMENT DETAILS ===");
        console.log("comment_data:", item.payload.comment_data);
        console.log("\ncomment_meta keys:", Object.keys(item.payload.comment_meta || {}));
        console.log("\ncomment_meta values:", JSON.stringify(item.payload.comment_meta, null, 2));
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
