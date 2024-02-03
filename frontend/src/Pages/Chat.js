import React, { useState } from "react";

import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const Chat = () => {
    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{width: "100%"}}>   
            {user && <SideDrawer />}
            
            <Box display={"flex"}  justifyContent={"space-between"} width={"100%"} height={"92.8vh"} padding={"10px"}>
                {user && (<MyChats fetchAgain={fetchAgain}  />)} 
                {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={ setFetchAgain }/>)} 
            </Box>
        </div>
    );
};

export default Chat;
