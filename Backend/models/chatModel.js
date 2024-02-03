const mongoose = require('mongoose');

// chat model 
const chatModel = mongoose.Schema(
    {

        chatName:           //chat send to user_name (or Group_name)
        {
            type: String,
            trim: true,
        },
        
        isGroup:            // Is it a group chat?
        {
            type: Boolean,
            default: false,
        },

        users:              // user name's (chatting with) 
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                }
            ],
        
        latestMessage:     //last message with a perticular person
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        
        GroupAdmin:     //If group - then admin name 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        

    },

    {
        timestamps: true,
    }
);


const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;