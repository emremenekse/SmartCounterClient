const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/smart-counter-client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/smart-counter-client/browser/index.html'));
});

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${port}`);
});
