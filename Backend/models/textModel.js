const mongoose = require("mongoose");

const textModel = mongoose.Schema(
    {
        sender:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
        
        content:
                {
                    type: String,
                    trim: true
                },
                
        chat:
                {
                    type: mongoose.Schema.ObjectId,
                    ref: "Chat"
                },
    },

    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', textModel);
module.exports = Message;