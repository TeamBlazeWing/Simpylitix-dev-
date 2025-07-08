const paymentService = require('../services/payment.service');

exports.buyTickets = async (req, res) => {
  try {
    console.log('=== Buy Tickets Request ===');
    console.log('Event ID:', req.params.eventId);
    console.log('User ID:', req.user.id);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Authorization Header:', req.headers.authorization ? 'Present' : 'Missing');

    const { tickets, method } = req.body;
    const userId = req.user.id;
    const eventId = req.params.eventId;
    
    // Additional validation
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      console.log('❌ Invalid tickets array:', tickets);
      return res.status(400).json({ error: 'Valid tickets array is required' });
    }
    
    if (!method) {
      console.log('❌ Missing payment method');
      return res.status(400).json({ error: 'Payment method is required' });
    }
    
    // Log each ticket for debugging
    tickets.forEach((ticket, index) => {
      console.log(`Ticket ${index}:`, ticket);
    });
    
    console.log('✅ Validation passed, calling buyTickets service...');
    const ticketsData = await paymentService.buyTickets(eventId, tickets, method, userId);

    console.log('✅ Tickets purchased successfully:', ticketsData);

    res.status(200).json({
      success: true,
      message: 'Tickets purchased successfully',
      data: ticketsData
    });
  } catch (error) {
    console.error('❌ Payment error in controller:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ error: error.message || 'Failed to process payment' });
  }
}

exports.buyPoints = async (req, res) => {
  try {
    const { pointsAmount, method } = req.body;
    const userId = req.user.id;
    const paymentData = await paymentService.buyPoints(pointsAmount, method, userId);

    res.status(200).json({
      success: true,
      message: 'Points purchased successfully',
      data: paymentData
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
}

exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await paymentService.getPaymentHistory(userId);

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
}

exports.verifyPayment = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const userId = req.user.id;
    const paymentResult = await paymentService.verifyPayment(paymentId, userId);

    res.status(200).json({
      success: true,
      data: paymentResult
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
}



