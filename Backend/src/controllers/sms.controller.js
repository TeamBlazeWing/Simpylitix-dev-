const smsService = require('../services/sms.service');

exports.handleIncomingSMS = async (req, res) => {
  try {
    let { version, applicationId, sourceAddress, message, requestId, encoding } = req.body;
    console.log('Received SMS:', req.body);
    sourceAddress = sourceAddress.replace('tel:', ''); // Normalize phone number format
    
    console.log(`📱 Incoming SMS from ${sourceAddress}: ${message}`);
    
    // Process the SMS
    await smsService.processIncomingSMS(sourceAddress, message);
    
    res.status(200).json({ status: 'processed' });
  } catch (error) {
    console.error('SMS processing error:', error);
    res.status(500).json({ error: 'Failed to process SMS' });
  }
};

exports.sendEventUpdate = async (req, res) => {
  try {
    const { eventId, userId, updateMessage } = req.body;
    
    const result = await smsService.sendEventUpdate(eventId, userId, updateMessage);
    
    res.status(200).json({ 
      success: true, 
      message: 'Update message sent successfully',
      result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
