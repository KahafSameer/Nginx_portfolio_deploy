const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Load data from JSON
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { data });
});

app.get('/projects', (req, res) => {
  res.render('projects', { data });
});

app.get('/education', (req, res) => {
  res.render('education', { data });
});

app.get('/contact', (req, res) => {
  res.render('contact', { data });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
