const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { sendMessage, allMessage } = require("../controllers/messageController")
const router = express.Router();

router.route('/').post(protect, sendMessage);
router.route('/:chatID').get(protect, allMessage);


module.exports = router;
