const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/api/v1/employees', require('./routes/employeeRoutes'));
app.use('/api/v1/patients', require('./routes/patientRoutes'));
app.use('/api/v1/clinic', require('./routes/clinicRoutes'));
app.use('/api/v1/appointments', require('./routes/appointmentRoutes'));
app.use('/api/v1/pharmacy', require('./routes/pharmacyRoutes'));
app.use('/api/v1/diagnostics', require('./routes/diagnosticRoutes'));
app.use('/api/v1/finance', require('./routes/financeRoutes'));
app.use('/api/v1/logistics', require('./routes/logisticsRoutes'));
app.use('/api/v1/support', require('./routes/supportRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('Hospital Management System API is running...');
});

app.use(errorMiddleware);

const startServer = async () => {
    try {
        const connection = await db.getConnection();
        console.log(' Database connected successfully!');
        connection.release(); 

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


