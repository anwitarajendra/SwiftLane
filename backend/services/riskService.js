const axios = require('axios');
require('dotenv').config();

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

async function getRiskData(deliveryId, customerId) {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/predict`, null, {
            params: { 
                delivery_id: deliveryId, 
                customer_id: customerId 
            }
        });

        const mlData = response.data.data;

        return {
            risk_score: mlData.risk_score * 100, 
            risk_type: mlData.risk_category.toLowerCase(), 
            recommended_message: mlData.recommended_message,
            live_metrics: mlData.live_metrics
        };
    } catch (error) {
        console.error("Error fetching ML Risk Data:", error.message);
        return { risk_score: 0, risk_type: "safe" };
    }
}

module.exports = { getRiskData };