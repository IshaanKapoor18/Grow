const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// for creating or accessing a one on one chat with user
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("UserId params not send with req");
        return res.status(400);
    }

    var isChat = await Chat.find(
        {
            isGroup: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        }
    ).populate("users", "-password").populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    })

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroup: false,
            users: [req.user._id, userId]
        };

        try {
            const createchat = await Chat.create(chatData);
            const Fullchat = await Chat.findOne({ _id: createchat._id }).populate("users", "-password");
            
            res.status(200).send(Fullchat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChat = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("GroupAdmin", "-password")
            .populate("latestMessage")
        .sort({ updatedAt: -1 })
    .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
                })
                    
                res.status(200).send(results)
        })
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please Fill all the fields"})
    }
    var users = JSON.parse(req.body.users);
    

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group Chat");
    }
    
    users.push(req.user);
    console.log(users);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroup: true,
            users: users,
            GroupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("GroupAdmin", "-password");
        
        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("GroupAdmin", "-password");
        
    if (!updatedChat) {
        res.status(404);
        throw new Error("Group you tried to rename not found!")
    }
    else {
        res.json(updatedChat);
    }
    
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId}
        },
        {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("GroupAdmin", "-password");
    
    if (!added) {
        res.status(404);
        throw new Error("Group you tried to access does not exist.")
    } else {
        res.json(added);
    }
    
});
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId}
        },
        {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("GroupAdmin", "-password");
    
    if (!removed) {
        res.status(404);
        throw new Error("Group you tried to access does not exist.")
    } else {
        res.json(removed);
    }
    
});





module.exports = { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup };


