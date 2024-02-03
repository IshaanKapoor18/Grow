import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Center, MenuItem, MenuDivider, IconButton, Image, Textarea } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import React, {useState} from "react";
import "./SideDrawer.css"
import { ChatState } from "../../context/chatProvider";
import { useDisclosure } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { Modal } from "@chakra-ui/react";
import { ModalOverlay } from "@chakra-ui/react";
import { ModalHeader } from "@chakra-ui/react";
import { ModalBody } from "@chakra-ui/react";
import { ModalCloseButton, Lorem, ModalContent, ModalFooter } from "@chakra-ui/react";
import "./SideDrawer.css"
const Profile = ({user, children}) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    console.log(user);


    return (
        <>
            {
                children ? <span onClick={onOpen} >{children}</span> : (
                    <IconButton d={{base:"flex"}  } icon={<ViewIcon />} onClick={onOpen}/>
                )
            }

            <Modal size={"lg"} isOpen={isOpen}  onClose={onClose} >
                <ModalOverlay />
                    <ModalContent display={"flex"}>
                        <ModalHeader fontFamily={"Handlee"}>Hello, {user.name}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody display={"flex"}>
                        <Avatar cursor='pointer' name={user.name} src={user.pic} />
                        
                        <Text p={"10"} fontFamily={"Handlee"} fontSize={"18"}>
                           
                            Email : {user.email}
                            
                            
                        </Text>
                        <Text  fontFamily={"Handlee"} fontSize={"28"}>
                            Name : {user.name}
                            
                            
                        </Text>
                        
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                                </Button>
                    </ModalFooter>
                </ModalContent>
        </Modal>

        </>
    );
}

export default Profile;