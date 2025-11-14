const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stores', require('./routes/store.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/ratings', require('./routes/rating.router'));
app.use('/api/owner', require('./routes/owner.routes'));


app.get('/test', (req, res) => {
  res.json({ message: "Test route working 🎉", time: new Date() });
});



module.exports = app;
