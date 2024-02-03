import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, Spinner } from "@chakra-ui/react";
import React, {useState} from "react";
import "./SideDrawer.css"
import { ChatState } from "../../context/chatProvider";
import Profile from "./Profile";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useToast } from '@chakra-ui/react';
import { useDisclosure, Input } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserData/UserListItem";
import { getSender } from "../../config/chatLogics";
import D from "../../Image/ding.mp3"
import Error_sound_noti from "../../Image/error.mp3"

const SideDrawer = () => {
    const toast = useToast()
    const g = new Audio(D);
    const Err_sound = new Audio(Error_sound_noti);
    const { user, setselectedChat, chats, setchats, notification, setnotification } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState()
    const history = useHistory();
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const logOut = () => {
        localStorage.removeItem("userInfo");
        history.push("/")
        window.location.reload(false);
    }

    const SearchUser = async() => {
        if (!search) {
            Err_sound.play();
            toast({
                title: "Write User name",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top-left",
            });
            
            return;
        }
        try {
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            
            const { data } = await axios.get(`/grow/user?search=${search}`, config)
            g.play();
            setloading(false);
            
            setsearchResult(data);
        } catch (error) {
            Err_sound.play();
            toast({
                title: "Failed to search user",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
            });
        }

    }
    const accesschat = async(userId) => {
        try {
            setloadingChat(true);
            const config = {
                headers: {
                    "Content-type":"application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.post("/grow/chat", { userId }, config)
            
            if(!chats.find((c)=>c._id === data._id))     setchats([data, ...chats])

            setselectedChat(data);
            setloadingChat(false);
            onClose();

        } catch (error) {
            Err_sound.play();
            toast({
                title: "Failed to load User's Chat",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
            });
        }
    }

    return (
        <>
            <Box
                justifyContent={"space-between"}
                alignItems={"center"}
                display={"flex"}
                bg={"linear-gradient( #0080ff, #1a8cff, #3399ff, #4da6ff, #66b3ff, #80bfff, #99ccff, #b3d9ff, #cce6ff, #e6f2ff)"}
                p={"5px 10px 5px 10px"}
                w={"100%"}
                borderWidth={"5px"}     
                border={"10px"}
                borderColor={"#003366"}
            >
                <Tooltip label="Find Connections" hasArrow placement="bottom-end">
                    <Button variant={"ghost"} onClick={onOpen}>
                        <i className="fas fa-search" color="white"></i>
                        <Text display={{base:"none", md:"flex"}} px={"3"}>
                            Search
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={"4xl"} fontFamily={"Fasthand"}
                    
                >
                    grow
                    
                </Text>
                <div>
                    

                    <Menu>
                        
                        

                        <MenuButton pr={10}>
                            {/* <HamburgerIcon > */}
                            {/* <NotificationBadge count={notification.length} effect={Effect.SCALE}/> */}
                            {/* <  NotificationBadge count={notification.length} effect={ Effect.SCALE }  /> */}
                            <BellIcon fontSize={"2xl"} />
                            {notification.length}
                        </MenuButton>
                        

                        <MenuList pl={3}>
                            {(!notification.length && "No New Message")}

                            

                            {
                                
                                
                                
                                notification.map(noti => (
                                <MenuItem key={noti._id} onClick={() => {
                                    
                                    setselectedChat(noti.chat)
                                    setnotification(notification.filter((n) => n !== noti));
                                    
                                    
                                   
                                }}>
                                    {noti.chat.Group?(`New Message in ${noti.chat.chatName} `):(`New Message from ${getSender(user, noti.chat.users)}  `)}
                                    {/* { (
                                            
                                                toast({
                                                title: `New Message Recived`,
                                                status: "success",
                                                duration: 3000,
                                                isClosable: true,
                                                position: "top",
                                            })
                                            
                                    )} */}
                                    

                                    
                                </MenuItem>
                                
                            )) }
                        </MenuList>
                                
                        
                        {/* here */}
                        

                        
                                        
                        { console.log(notification)}
                                        {
                                    
                            // (notification.length > 1) ?
                                
                            //         toast({
                            //                     title: `New Message Recived`,
                            //                     status: "success",
                            //                     duration: 3000,
                            //                     isClosable: true,
                            //                     position: "top",
                            //                 })
                            //     :<></>
                                
                             }


                        


                        {/* here */}




                    </Menu>
                    <Menu >
                       
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} alignItems={"center"} pl={1}>
                        
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} p={1} placeholder={user.name}/> 
                            
                        </MenuButton>
                        
                        <MenuList>
                            <Profile user={user}>
                            <MenuItem fontFamily={"Handlee"}>My Profile - {user.name}</MenuItem>
                            </Profile>
                            <MenuDivider ></MenuDivider>
                                <MenuItem fontFamily={"Handlee"} onClick={logOut}>Logout</MenuItem>
                        </MenuList>

                    </Menu>
                </div>

            </Box>

            <Drawer placement="left" onClose={onClose} onOpen={onOpen} isOpen={isOpen}
            
            >
                <DrawerOverlay />
                <DrawerContent >
                    <DrawerHeader borderBottomWidth={1} content="center" fontFamily={"Handlee"} fontSize={31} bg={"linear-gradient( #0080ff, #1a8cff, #3399ff, #4da6ff, #66b3ff, #80bfff, #99ccff, #b3d9ff, #cce6ff, #e6f2ff, #ffffff)"}
                    _hover={{
                                    color: "white",
                                }}
                    >Add user to connect </DrawerHeader>
                    <DrawerBody bg={"linear-gradient(#ffffff , #e6f5ff, #ccebff, #b3e0ff, #99d6ff, #80ccff, #66c2ff, #4db8ff, #33adff, #1aa3ff, #0099ff, #007acc, #006bb3, #005c99, #004d80, #003d66, #002e4d)"}>
                    <Box display={"flex"} pb={2} >
                            <Input 

                            placeholder="Search User"
                            mr={2}
                            fontFamily={"Patrick Hand"}
                            fontSize={20}
                            value={search} 
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            
                            <Button
                                color={"green"}
                                onClick={SearchUser}
                                 _hover={{
                                    background: "green",
                                    color: "white",
                                }}
                        >Go</Button>
                        </Box >
                        {
                            loading ? (
                                <ChatLoading />
                            ):
                                (
                                    searchResult?.map(user => (
                                        <UserListItem key={user._id}
                                            user = {user}
                                            handleFunction={()=>accesschat(user._id)}
                                        />
                                    ))
                                    
                                    
                                )
                            
                            
                            
                            
                        }
                        {loadingChat && <Spinner ml="auto" d="flex"/>}
                </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    );
}

export default SideDrawer;