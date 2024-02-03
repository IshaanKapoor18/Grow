const asyncHandler = require("express-async-handler");
const Message = require("../models/textModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async(req, res) =>{
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid Data send at Message");
        return res.sendStatus(400);
    }

    var newText = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try {
        var message = await Message.create(newText);

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        });
        
        
        // let now = message
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
        // console.log(message);
        // console.log(await Message.find({ chat: req.body.chatId }).populate("sender", "name pic email").populate('chat'));
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
const allMessage = asyncHandler(async(req, res) =>{
    try {
            // console.log(req.params);
            const messages = await Message.find({ chat: req.params.chatID }).populate("sender", "name pic email").populate('chat');
            // console.log(messages);
            res.json(messages);

        } catch (error) {
            console.log(error);
            res.status(400)
             throw new Error(error.message)
        }
})

module.exports = { sendMessage, allMessage }
