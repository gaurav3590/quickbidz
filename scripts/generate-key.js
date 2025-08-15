const crypto = require("crypto");

// Generate a random 32-byte key and convert it to base64
const key = crypto.randomBytes(32).toString("base64");

console.log("Generated Encryption Key:");
console.log(key);
console.log("\nAdd this to your .env file as:");
console.log(`NEXT_PUBLIC_ENCRYPTION_KEY="${key}"`);
