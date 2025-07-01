const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/notifications/health', (req, res) => {
  res.json({ status: 'OK', service: 'notification-service' });
});

app.get('/notifications', (req, res) => {
  res.json({ 
    message: 'Notification service is running',
    notifications: []
  });
});

app.post('/notifications', (req, res) => {
  const { message, recipient } = req.body;
  
  // Mock notification sending
  console.log(`Sending notification to ${recipient}: ${message}`);
  
  res.json({ 
    success: true,
    message: 'Notification sent successfully'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Notification service running on port ${PORT}`);
});
