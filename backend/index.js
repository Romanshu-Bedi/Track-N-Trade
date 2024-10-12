// trackntrade-backend/index.js

const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello from TracknTrade Backend!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
