const paymentService = require('../services/payment.service');

exports.buyTickets = async (req, res) => {
  try {
    const { tickets, method } = req.body;
    const userId = req.user.id;
    const eventId = req.params.eventId;
    const ticketsData = await paymentService.buyTickets(eventId, tickets, method, userId);

    console.log('Tickets purchased:', ticketsData);

    res.status(200).json({
      success: true,
      message: 'Tickets purchased successfully',
      data: ticketsData
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
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



