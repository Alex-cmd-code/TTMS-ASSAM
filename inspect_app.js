const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
const keys = new Set();
for (let line of lines) {
  const m = line.match(/localStorage\.(?:getItem|setItem|removeItem)\((['"`])(.*?)\1/);
  if (m) {
    keys.add(m[2]);
  }
}
console.log('LocalStorage keys found:');
console.log(Array.from(keys));
