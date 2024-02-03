import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
    ModalCloseButton,
    useDisclosure,
   
  Button,
  FormControl,
  Box,
  Input,

} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import { ChatState } from "../../context/chatProvider";
import axios from 'axios';
import UserListItem from '../UserData/UserListItem';
import UserBadgeItem from '../UserData/UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGoupChatName] = useState();
    // const [selectedChat, setSelectedChat] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUsers, setselectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    // const 
    const toast = useToast();
  const { user, chats, setchats } = ChatState();
  const handleSearch = async(query) => {
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
  const handleSubmit = async() => {
    if (!groupChatName) {
      toast({
                title: "Please enter the Group Name",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top-left",
      });
      return;
    }
    if (!selectedUsers) {
      toast({
                title: "Please Add participants",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top-left",
      });
      return;
    }
    try {
        const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
      }
      const { data } = axios.post("/grow/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u)=> u._id))
      } ,  config)
      
      if(data)
      setchats([data, ...chats]);
      onClose();
      window.location.reload(false);
      toast({
                title: "Group Created",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
      });
      
    } catch (error) {
        toast({
                title: "Failed to create Group",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
      });
    }

  }
  const Deleted = (del) => {
    setselectedUsers(selectedUsers.filter(sel=> sel._id !== del._id))
  }
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
                title: "User Already added",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top-left",
      });
      return;
    }
    else
    setselectedUsers([...selectedUsers, userToAdd])
  }
  return (
    <>
          <span onClick={onOpen}>{children}</span>

         
          
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"cursive"}
            display="flex"
            justifyContent={"center"}
          >Group Info</ModalHeader>
          <ModalCloseButton />
                <ModalBody display="flex" flexDir="column" alignItems={"center"}>
                    <FormControl>
                        <Input mb={3} placeholder='Group Name'
                        onChange={(e)=> setGoupChatName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <Input mb={3} placeholder='Add participants'
                        onChange={(e)=> handleSearch(e.target.value)}
                        />
            </FormControl>

            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              
            {selectedUsers.map(user => (
              <UserBadgeItem
              key={user._id}
              user={user}
              handleFunction={()=>Deleted(user)}
              
              />
              ))}
            </Box>

            {loading ? <div>Please wait...</div> : (
              searchResult?.slice(0, 4).map(user => (
                <UserListItem key={user._id} user={user} handleFunction={(e) => handleGroup(user)}/>

              ))
              )}
                </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal;
