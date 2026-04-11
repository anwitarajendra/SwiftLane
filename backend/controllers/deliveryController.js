const { getRiskData } = require('../services/riskService');
const { sendWhatsAppMessage } = require('../services/whatsappService');

exports.getDeliveries = async (req, res) => {
    try {
        const riskData = await getRiskData(); 
        
        res.json(riskData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch integrated delivery data" });
    }
};

exports.processRisk = async (req, res) => {
    const { delivery_id, customer_id, phone } = req.body;

    try {
        const mlResult = await getRiskData(delivery_id, customer_id);

        if (mlResult.risk_score > 75) {
            let message = "";
            
            if (mlResult.risk_type === "high") {
                message = `*SwiftLane Delivery Alert* \n\nDelivery ID: ${delivery_id}\n\n${mlResult.recommended_message}\n\nHow would you like to proceed?\n1. Continue anyway\n2. Reschedule`;
            }

            console.log("📱 Triggering WhatsApp for delivery:", delivery_id);
            await sendWhatsAppMessage(phone, message);
        }

        res.json({
            status: "processed",
            ml_results: mlResult
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: "Processing failed" });
    }
};