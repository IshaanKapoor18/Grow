import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box, FormControl, IconButton, Image, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/chatLogics";
import Profile from "./miscellaneous/Profile";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./style.css"
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client"
import notify from "../Image/sound_noti.mp3"
import Err from "../Image/error.mp3"
import Tap from "../Image/send.mp3"

const ENDPOINT = "http://localhost:5000"
let socket, selectedChatCompare;


const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { selectedChat, setselectedChat, user, chats, setchats, notification, setnotification  } = ChatState();
    const [message, setMessage] = useState([]);
    const [loading, setloading] = useState(false);
    const [newmessage, setnewmessage] = useState();
    const [socketConnected, setsocketConnected] = useState(false);
    const [typing, settyping] = useState(false);
    const [istyping, setistyping] = useState(false);
    const toast = useToast();
    const audio = new Audio(notify);
    const Er = new Audio(Err);
    const go = new Audio(Tap);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                            headers: {
                            "Content-type":"application/json",
                            Authorization: `Bearer ${user.token}`,
                        }
            }
            setloading(true)
            const { data } = await axios.get(`/grow/message/${selectedChat._id}`, config)

            console.log(data);
            setMessage(data);
            setloading(false);

            socket.emit("join chat", selectedChat._id);

        } catch (error) {
            toast({
                title: "Failed to load the chat!!",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user)
        socket.on("connected", () => setsocketConnected(true))
        socket.on("typing",()=>setistyping(true))
        socket.on("stop typing",()=>setistyping(false))
    }, [])

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat])

    

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            

            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //    give noti
                
                if (!notification.includes(newMessageRecieved)) {
                    
                    // audio.volume = 0.2;
                    // toast({
                    //                         title: `Message from ${ newMessageRecieved.chatName }`,
                    //                         status: "success",
                    //                         duration: 500,
                    //                         isClosable: true,
                    //                         position: "top-left",
                    //                     });

                                    // console.log("jj");

                    setnotification([newMessageRecieved, ...notification])
                    
                   
                    
                    // console.log("---------");
                    // console.log(notification);
                    // console.log(newMessageRecieved);
                    //  toast({
                    //                         title: `Message from ${ newMessageRecieved.chatName }`,
                    //                         status: "success",
                    //                         duration: 2000,
                    //                         isClosable: true,
                    //                         position: "top-left",
                    //                     });
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessage([...message, newMessageRecieved])
                  
           }
       })
    })



    const send = async (e) => {
        
        if (e.key === 'Enter' && newmessage) {
            go.play()
            socket.emit("stop typing", selectedChat._id);
            try {
                    const config = {
                            headers: {
                            "Content-type":"application/json",
                            Authorization: `Bearer ${user.token}`,
                        }
                }
                setnewmessage("")

                const { data } = await axios.post("/grow/message", {
                    content: newmessage,
                    chatId:selectedChat._id
                }, config);
                // console.log(data);

                socket.emit("new message", data)
                
                setMessage([...message, data]);
            } catch (error) {
                toast({
                title: "Failed to send!!",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left",
            });
            }
        }
    }


    
    const typingHandler = (e) => {
        setnewmessage(e.target.value);

        // typing indid
        if (!socketConnected) return;
        if (!typing) {
            settyping(true)
            socket.emit("typing", selectedChat._id)
        }
        let lastypingtime = new Date().getTime();
        let timerlength = 2000;
        
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastypingtime;

            if (timeDiff >= timerlength && typing) {
                socket.emit("stop typing", selectedChat._id)
                settyping(false)
            }
        }, timerlength);

    }

    return (
        <>
            {/* {console.log(selectedChat)} */}
            
            {selectedChat?(
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w={"100%"}
                        fontFamily={"cursive"}
                        display={"flex"}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={()=> setselectedChat("")}
                        />
                        {
                            !selectedChat.isGroup ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <Profile user={getSenderFull(user, selectedChat.users) } />
                                </>
                            ) : (
                                    <>{selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}
                                            
                                        />
                                    </>
                            )
                        }

                    </Text>
                    <Box
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"}
                        p={3}
                        bg={"rgba(240, 248, 255, 0.432)"}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                        color={"black"}
                    >
                        {loading ? (
                            <Spinner size={"xl"} w={20} h={20} alignSelf={"center"} margin={"auto"}/>                          
                        ) : (
                                <div className="messages">
                                    
                                    {/* Message */}

                                    <ScrollableChat message={message} />
                                
                                
                                </div>
                        )}

                        <FormControl onKeyDown={send} isRequired mt={3}>
                            {istyping ? <div style={{padding:"3px"}}>Typing...</div>: <></>}
                            
                            <Input
                                bg={"white"}
                                variant={"filled"}
                                placeholder="Enter a Message"
                                color={"black"}
                                _hover={{ bg: "white" }}
                                onChange={typingHandler}
                                value={newmessage}
                                
                            />
                            
                        </FormControl>
                    </Box>
                </> 
            ):(
                <Box
                display={"flex"}
                alignItems="center"
                
                h={"100%"}
            >
                <Text fontSize={"3xl"} pb="3" fontFamily={"cursive"}>
                    Click on your connection to Chat 
                </Text>
            </Box>
            )}
        </>
    )
}

export default SingleChat;
