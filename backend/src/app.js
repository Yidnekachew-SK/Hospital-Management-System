const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// 1. Security & Parsing (Must be first)
app.use(cors());
app.use(express.json());

// 2. Routes (Mounted exactly once)
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/employees', require('./routes/employeeRoutes'));
app.use('/api/v1/patients', require('./routes/patientRoutes'));
app.use('/api/v1/clinic', require('./routes/clinicRoutes'));
app.use('/api/v1/appointments', require('./routes/appointmentRoutes'));
app.use('/api/v1/pharmacy', require('./routes/pharmacyRoutes'));
app.use('/api/v1/diagnostics', require('./routes/diagnosticRoutes'));
app.use('/api/v1/finance', require('./routes/financeRoutes'));
app.use('/api/v1/logistics', require('./routes/logisticsRoutes'));
app.use('/api/v1/support', require('./routes/supportRoutes'));
app.use('/api/v1/records', require('./routes/recordRoutes'));

// 3. Error Handling
app.use(errorMiddleware);

// 4. Server Engine
const startServer = async () => {
  try {
    await db.getConnection();
    console.log('Database connected successfully!');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();