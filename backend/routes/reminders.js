const express = require('express');
const router = express.Router();
const { addReminder, getReminders, deleteReminder } = require('../controllers/reminderController');

router.post('/add-reminder', addReminder);
router.get('/get-reminders', getReminders);
router.delete('/delete-reminder/:reminderId', deleteReminder);

module.exports = router;
