
const fs = require('fs');
const path = require('path');

try {
  const content = fs.readFileSync('.env', 'utf8');
  const lines = content.split('\n');
  const env = {};
  lines.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });

  const required = [
    "ADMIN_PASSWORD", 
    "JWT_SECRET", 
    "GOOGLE_GEOCODING_API_KEY", 
    "DEAL_NOTIFICATION_EMAIL", 
    "TC_EMAIL", 
    "SMTP_HOST", 
    "SMTP_PORT", 
    "SMTP_USER", 
    "SMTP_PASS"
  ];

  const missing = required.filter(k => !env[k]);
  console.log("Missing keys:", JSON.stringify(missing));
  console.log("Current keys:", JSON.stringify(Object.keys(env)));

} catch (e) {
  console.error(e);
}
