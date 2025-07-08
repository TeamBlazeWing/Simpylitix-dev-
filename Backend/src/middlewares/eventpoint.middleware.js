const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if(user.points === undefined) {
      return res.status(400).json({ message: 'User points not initialized' });
    }
    if (user.points <= 0) {
      return res.status(403).json({ message: 'You have 0 points. Please recharge to continue.' });
    }

    await user.save();
    next();
  } catch (err) {
    console.error(' Event point validation failed:', err.message);
    res.status(500).json({ message: 'Failed to validate event points' });
  }
};
