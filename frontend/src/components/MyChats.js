import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box, useToast, Button, Stack, Text } from '@chakra-ui/react';
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/chatLogics";
import  GroupChatModal  from "./miscellaneous/GroupChatModal" 




const MyChats = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setselectedChat, user, chats, setchats } = ChatState();
    const toast = useToast();
    const history = useHistory();

    const chatSelected = (chat) => {
        
        console.log(chat);
        
        
        // setselectedChat([]);
        setselectedChat(chat);
        // let userInfo = JSON.parse(chat);
        
        
        return;
    }

    const fetchChats = async() => {
        try {
            
            const config = {
                headers: {
                   
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.get("/grow/chat", config);
            // console.log(data+"--");
            // console.log(data);
            // if(!chats.find((c)=>c._id === data._id))     setchats([data, ...chats])
            // chats.map((chat) => (
            //     if(chat!==undefined)    setchats([chat, ...chats])
            // ))
            

            if(data!==undefined)
            setchats(data)

        } catch (error) {
            // console.log(error);
            toast({
                title: "ERROR OCCURED",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left",
            });
            // history.push("/chats")
            
            
        }
    }
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        
        fetchChats();
    }, [fetchAgain])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir={"column"}
            alignItems={"center"}
            p={4}
            bg={"linear-gradient(#ffffff , #e6f5ff, #ccebff, #b3e0ff, #99d6ff, #80ccff, #66c2ff, #4db8ff, #33adff, #1aa3ff, #0099ff, #007acc, #006bb3, #005c99, #004d80, #003d66, #002e4d)"}
            w={{ base: "100%", md: "31%" }}
            borderRadius={"1g"}
            borderWidth={"1px"}
        >

            
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md:"30px" }}
                fontFamily={"cursive"}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                 Connections
                <GroupChatModal>

                    <Button
                        display={"flex"}
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                        bg={"linear-gradient(#ffffff , #e6f5ff, #ccebff, #b3e0ff, #99d6ff, #80ccff, #66c2ff, #4db8ff)"}
                        pr={3}
                        
                        >
                        Create Group 
                    </Button>

                </GroupChatModal>
            </Box>
            <Box
                display={"flex"}
                flexDir={"column"}
                p={3}
                bg={"rgba(255, 255, 255, 0.5)"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {chats ? (
                    <Stack overflowY={"scroll"}>
                        
                        {chats.map((chat) => (
                            // console.log(chats),
                            <Box
                                onClick={() => {if(chat!== undefined)  chatSelected(chat)}}
                                cursor={"pointer"}
                                bg={selectedChat === chat ? "linear-gradient( #008055, #009966, #00b377, #00cc88, #00e699, #00ffaa, #1affb2, #33ffbb, #4dffc3, #66ffcc, #80ffd4, #99ffdd, #b3ffe6, #ccffee, #e6fff7)" : "linear-gradient(#ffffff , #e6f5ff, #ccebff, #b3e0ff, #99d6ff, #80ccff, #66c2ff, #4db8ff, #33adff, #1aa3ff, #0099ff)"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={5}
                                py={4}
                                borderRadius={"lg"}
                                key={(chat!==undefined)?chat._id : console.log(chat)}
                                
                            >
                                <Text>
                                    { ( !chat.isGroup) ? (
                                        getSender(loggedUser, chat.users)
                                    ):(chat!==undefined &&  chat.chatName)}
                                </Text>
                            </Box>
                            ))}
                    </Stack>
                ):
                  (<ChatLoading />)  }
            </Box>

        </Box>
    );
}

export default MyChats;