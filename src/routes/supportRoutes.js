const express = require('express');
const { getSupportInfo, createTicket, getTickets, getTicketById } = require('../controllers/supportController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSupportInfo);

router.use(authenticate);
router.post('/tickets', createTicket);
router.get('/tickets', getTickets);
router.get('/tickets/:id', getTicketById);

module.exports = router;
