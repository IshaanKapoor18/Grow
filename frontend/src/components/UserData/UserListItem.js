import React from 'react'
import { ChatState } from '../../context/chatProvider'
import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Center, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Avatar } from "@chakra-ui/react";


const UserListItem = ({ user, handleFunction}) =>{
    // const { user } = ChatState();

    return (
        <Box
            onClick={handleFunction}
            cursor={"pointer"}
            bg={"#1a8cff"}
            borderStyle={"inset"}
            borderWidth={"2px"}
            borderColor={"#0066cc"}
            _hover={{
                background: "#002e4d",
                color: "white",
                
            }}

            w={"100%"}
            d="flex"
            alignItems={"center"}
            color={"blue"}
            px={3}
            py={2}
            mb={2}
            borderRadius={"lg"}
        >

            {console.log(user.pic)}

            <Avatar mr={2} size={"sm"} cursor={"pointer"}  src={ user.pic } />

            <Box>
                <Text>{user.name}</Text>
                <Text >
                    <b>Email: </b>
                    {user.email}
                </Text>
            </Box>

        </Box>
    )
}

export default UserListItem