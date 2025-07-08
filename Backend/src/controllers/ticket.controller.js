const { get } = require('mongoose');
const ticketService = require('../services/ticket.service');

exports.getMyTickets = async (req, res, next) => {
  try {
    const user = await ticketService.getMyTickets(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};