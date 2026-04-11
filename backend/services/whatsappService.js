const twilio = require('twilio');
require('dotenv').config();
let client;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH) {
    client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
}

async function sendWhatsAppMessage(to, message) {
    try {
        if (client && process.env.TWILIO_PHONE) {
            await client.messages.create({
                from: `whatsapp:${process.env.TWILIO_PHONE}`,
                to: `whatsapp:+91${to}`,
                body: message
            });
            console.log(`WhatsApp sent to +91${to}`);
        } else {
            console.log("Twilio keys missing. SIMULATION MODE:");
            console.log(`TO: +91${to}\n💬 MESSAGE: ${message}`);
        }
    } catch (error) {
        console.error("Twilio Error:", error.message);
    }
}

module.exports = { sendWhatsAppMessage };