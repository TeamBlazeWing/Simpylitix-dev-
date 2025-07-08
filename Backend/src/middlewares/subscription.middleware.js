const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.mobileNumber) {
      return res.status(400).json({ message: 'User or mobile number not found' });
    }

    // Check current stored subscription status
    const isSubscribed = user.subscriptionStatus === 'active' ;

    if (!isSubscribed) {
      return res.status(403).json({ message: 'Subscription required to create events.' });
    }

    // All good
    next();
  } catch (err) {
    console.error('Subscription middleware error:', err.message);
    return res.status(500).json({ message: 'Internal error during subscription check' });
  }
};
