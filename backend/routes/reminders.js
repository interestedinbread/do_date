const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/authMiddleware')
const { addReminder, getReminders, deleteReminder } = require('../controllers/reminderController');

router.post('/add-reminder', checkJwt, addReminder);
router.get('/get-reminders', checkJwt, getReminders);
router.delete('/delete-reminder/:reminderId', checkJwt, deleteReminder);

module.exports = router;
