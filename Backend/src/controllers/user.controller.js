const userService = require('../services/user.service');

exports.registerUser = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};





