const express = require('express');
const path = require('path');
const app = express();
const port = 8002; // Use the desired port

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../build')));

// Handle API requests here (if your app has API endpoints)

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
