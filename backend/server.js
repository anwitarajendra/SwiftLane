require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const deliveryRoutes = require('./routes/deliveryRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

app.use('/api', deliveryRoutes);
app.use('/api', webhookRoutes);

app.get('/', (req, res) => {
    res.json({ 
        status: "SwiftLane Integrated Gateway is active ", 
        ml_service: process.env.PYTHON_SERVICE_URL || "Connected"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Gateway running on http://localhost:${PORT}`);
    console.log(`Brain (Python) linked at: ${process.env.PYTHON_SERVICE_URL}`);
});