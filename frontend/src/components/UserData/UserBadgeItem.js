import React from 'react'
import { ChatState } from '../../context/chatProvider'
import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Center, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Avatar } from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons';


const UserBadgeItem = ({ user, handleFunction}) =>{
    return (
        <Box
            onClick={handleFunction}
            cursor={"pointer"}
            backgroundColor="purple"
            fontSize={12}
            variant="solid"
            m={1}
            mb={2}
            borderRadius={"lg"}
            py={1}
            px={2}
            color={"white"}
        >
            {user.name}
            <CloseIcon pl={1}/>
        </Box>
    )
}

export default UserBadgeItem