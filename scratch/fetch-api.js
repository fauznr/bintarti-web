const https = require("https");

https.get("https://bintarti.store/api/invitations/search?query=aqiqah_sayalindra-egyi&type=slug", (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      console.log("=== PUBLIC API INVITATION DETAILS ===");
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log("Failed to parse JSON:", data);
    }
  });
}).on("error", (err) => {
  console.error("HTTP GET failed:", err.message);
});
