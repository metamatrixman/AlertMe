const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function sendDynamicBusinessCard(userId, recipientPhone) {
    // 1. Create a unique URL for this specific user
    const dynamicMediaUrl = `https://yourdomain.com/vcard/${userId}`;

    // 2. Tell Twilio to send the MMS
    await client.messages.create({
        body: "Here is the business card you requested!",
        from: '+16672880655', // Your Twilio number
        to: recipientPhone,
        mediaUrl: [dynamicMediaUrl] // Twilio will "GET" this URL
    });
}

module.exports={sendDynamicBusinessCard};