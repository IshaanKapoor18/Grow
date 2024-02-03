import React, { useState } from "react";
import {Box, FormControl, IconButton, Input, Spinner, useDisclosure, useToast} from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
    ModalCloseButton,
  
} from '@chakra-ui/react'
import { ViewIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";
import UserBadgeItem from '../UserData/UserBadgeItem';
import axios from "axios";
// import UserListItem from "../UserData/UserListItem";
import UserListItem from "../UserData/UserListItem";
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setselectedChat, user, chats, setchats } = ChatState();
    const [groupChatName, setgroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameloading, setrenameloading] = useState(false)
    // import axios from "axios";

    const toast = useToast();

    
    const Rename = async () => {
        if (!groupChatName) return;
        try {
            setrenameloading(true);
             const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            console.log(groupChatName);
            // const {data} = await axios.get(`/grow/user?search=${search}`, config)
            const { data } = await axios.put('/grow/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)

            console.log(data);

            setselectedChat(data)
            setFetchAgain(!fetchAgain)
            setrenameloading(false);

        } catch (error) {
            toast({
                title: "Failed to rename the Group",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
            });
            setrenameloading(false);
        }
        setgroupChatName("")
    // setselectedUsers(selectedUsers.filter(sel=> sel._id !== del._id))
    }
     const handleSearch = async(query) => {
         // setselectedUsers(selectedUsers.filter(sel=> sel._id !== del._id))
         setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
        const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
      }
      
      const { data } = await axios.get(`/grow/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      if(data)
      setSearchResult(data)
    } catch (error) {
      toast({
                title: "User not found",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
            });
    }
    }
    const handleRemove = async (user1) => {
         

         if (selectedChat.groupAdmin!==undefined && user!==undefined && user1!==undefined &&  selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only Admin can remove User!!",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
            });
         }

         try {
            setLoading(true);
            const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
            }
      
             const { data } = await axios.put('/grow/chat/groupremove', {
                 chatId: selectedChat._id,
                 userId: user1._id
             }, config);
             

            //  console.log(data);
            user1._id === user._id ? setselectedChat():setselectedChat(data);
             setFetchAgain(!fetchAgain)
             fetchMessages();
             setLoading(false)
             if(user1._id !== user._id)
             {
                 toast({
                    title: `Removed ${user1.name}` ,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
             }
             if(user1._id === user._id)
             {
                 toast({
                    title: `You left the Group` ,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                 });
                 
             }
             
         } catch (error) {
            toast({
                title: "Unable to Remove User",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
            });
         }
         

    }
     const handleAddUser = async(user1) => {
         if (selectedChat.users.find((u) => u._id === user1._id)) {
                toast({
                title: "User Already exist in the group",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
                });
             return;
         }
         if (selectedChat.GroupAdmin._id === user1._id) {
                toast({
                title: "You cannot add admin again",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
                });
             return;
         }
         if (selectedChat.GroupAdmin._id !== user._id) {
                toast({
                title: "Only Group Admin can Add!",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
                });
             return;
         }
         
         try {
             setLoading(true);

              const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
      
             const { data } = await axios.put('/grow/chat/groupadd', {
                 chatId: selectedChat._id,
                 userId: user1._id
             }, config);
             
             setselectedChat(data);
             setFetchAgain(!fetchAgain);
             setLoading(false);
         } catch (error) {
            toast({
                title: "Cannot Add user!!",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left",
                });
             return;
         }



    }

    return (
        <>
            <IconButton display={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />

                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        display={"flex"}
                        justifyContent={"center"}
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            w={"100%"}
                            display={"flex"}
                            flexWrap={"wrap"}
                            pb={3}
                        >
                            {selectedChat.users.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>handleRemove(user)}
                                    
                                    />
                            ))}
                        </Box>


                        <FormControl display={"flex"}>
                            <Input placeholder="Chat Name" mb={3} value={groupChatName}   onChange={ (e)=>setgroupChatName(e.target.value) }/>
                            <Button variant={"solid"} colorScheme="teal" ml={1} isLoading={renameloading} onClick={Rename}>Rename</Button>
                        </FormControl>
                        <FormControl display={"flex"}>
                            <Input placeholder="Add User" mb={3}  onChange={(e) => handleSearch(e.target.value)} />
                            {/* <Button variant={"solid"} colorScheme="teal" ml={1} isLoading={renameloading} onClick={Rename}>Update</Button> */}
                        </FormControl>
                        {loading ? (
                        <Spinner size={"lg"} />
                        ) : (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={()=>handleAddUser(user)}
                                    />
                                ))
                        )
                        
                            
                        }
                        



                    </ModalBody>
                    <ModalFooter>
                            <Button onClick={()=> handleRemove(user)} colorScheme="red">
                                Leave
                            </Button>
                        </ModalFooter>

                   
                    </ModalContent>
                </Modal>
        </>
    )
}

export default UpdateGroupChatModal;
 