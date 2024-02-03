import React from "react";
import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
const ChatBox = ({fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems={"center"}
            flexDir="column"
            p={3}
            bg={"linear-gradient(#ffffff , #e6f5ff, #ccebff, #b3e0ff, #99d6ff, #80ccff, #66c2ff, #4db8ff, #33adff, #1aa3ff, #0099ff, #007acc, #006bb3, #005c99, #004d80, #003d66, #002e4d)"}
            w={{ base: "100%", md: "68%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
}

export default ChatBox;