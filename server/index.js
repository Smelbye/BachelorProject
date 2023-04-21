const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'MONGODB_URL', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Import routes
const doctorAuthRoutes = require('./routes/doctorAuthMongo');
const oracleRoutes = require('./routes/oracleRoutes'); // Import the Oracle routes

// Use routes
app.use('/api/doctor', doctorAuthRoutes);
app.use('/api', oracleRoutes); // Use the Oracle routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
