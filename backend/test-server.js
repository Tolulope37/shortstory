const express = require('express');
const app = express();
const PORT = 3002;

app.get('/', (req, res) => {
  res.send('Hello! This server is working on port 3002');
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
}); 