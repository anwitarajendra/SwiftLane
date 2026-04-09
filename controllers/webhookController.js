let deliveries = []; // temporary reference (we’ll improve later)

exports.handleIncomingMessage = (req, res) => {
    const msg = req.body.Body.toLowerCase();
    const from = req.body.From;

    console.log("Incoming message:", msg);
    console.log("From:", from);

    let response = "";

    // Simple logic
    if (msg.includes("1") || msg.includes("available")) {
        response = "Delivery will proceed as planned.";
    }
    else if (msg.includes("2") || msg.includes("gate")) {
        response = "Package will be left at the gate.";
    }
    else if (msg.includes("3") || msg.includes("watchman")) {
        response = "Package will be handed to watchman.";
    }
    else if (msg.includes("4") || msg.includes("reschedule")) {
        response = "Your delivery has been rescheduled.";
    }
    else {
        response = "Thank you for your response!";
    }

    res.send(`<Response><Message>${response}</Message></Response>`);
};