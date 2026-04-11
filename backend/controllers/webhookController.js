const axios = require('axios');
require('dotenv').config();

const PYTHON_SERVICE = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

exports.handleIncomingMessage = async (req, res) => {
    const msg = req.body.Body.toLowerCase();
    const from = req.body.From;

    console.log(` Incoming WhatsApp from ${from}: "${msg}"`);
    const phone = from.replace('whatsapp:+91', '');

    let response = "";
    let newStatus = "";

    try {
        const dbResponse = await axios.get(`${PYTHON_SERVICE}/deliveries/all`);
        const delivery = dbResponse.data.deliveries.find(d => d.customer_details.phone === phone);

        if (delivery) {
            if (msg === "1" || msg.includes("available")) {
                response = "Acknowledged. Delivery will proceed as planned.";
                newStatus = "Confirmed";
            } 
            else if (msg === "2" || msg.includes("gate")) {
                response = "Got it. Package will be left at the gate.";
                newStatus = "Left at Gate";
            }
            else if (msg === "2" || msg.includes("reschedule")) {
                response = "Request received. Your delivery has been rescheduled.";
                newStatus = "Rescheduled";
            } 
            else {
                response = "I didn't quite get that. Please reply with the numbers 1, 2, or 3.";
            }

            if (newStatus) {
                await axios.put(`${PYTHON_SERVICE}/update-status`, {
                    delivery_id: delivery.delivery_id,
                    status: newStatus
                });
                console.log(`Database updated: Delivery ${delivery.delivery_id} is now ${newStatus}`);
            }

        } else {
            response = "Sorry, we couldn't find an active delivery for this number.";
        }
    } catch (error) {
        console.error(" Webhook Error:", error.message);
        response = "System temporarily unavailable. Please try again later.";
    }
    res.type('text/xml');
    res.send(`<Response><Message>${response}</Message></Response>`);
};