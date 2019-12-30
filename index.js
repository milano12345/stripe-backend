const app = require("./server.js");

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`\n=== Server listening on port ${PORT} ===\n`);
});
