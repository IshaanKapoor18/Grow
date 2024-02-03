import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Container, Box, Text } from '@chakra-ui/react'
import Signup from "../components/Authentication/Signup";
import Login from "../components/Authentication/Login";
import { useHistory } from "react-router";
import {  useEffect } from 'react';

const Home = () => {

    const history = useHistory();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        

        if (user) {
            history.push('/chats')
        }
    }, [history])
    return (
       
            <Container maxW={"xl"} centerContent >
                <Box
                    m="40px 0 15px 0"
                    paddingLeft={"50px"}
                    d="flex"
                    justifyContent={"center"}
                    p={3}
                    bg={"white"}
                // opacity={0.5}
                backgroundColor={"rgba(255, 255, 255, 0.37)"}
                    borderRadius="lg"
                    borderWidth="1px"
                >
                <Text
                    fontSize={"4xl"}
                    fontFamily={"Rubik Doodle Triangles"}
                    color={"black"}
                >Grow: Connect with people</Text>
                </Box>

                <Box bg={"rgba(255, 255, 255, 0.37)"} w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
                    <Tabs size='md' variant='enclosed'>
                        <TabList mb={"1em"}>
                            <Tab width={"50%"} color={"black"}>Login</Tab>
                            <Tab width={"50%"} color={"black"}>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel >
                             <Login /> 
                            </TabPanel>
                            <TabPanel>
                            <Signup />
                            </TabPanel>
                        </TabPanels>
                        </Tabs>
                </Box>
             
            </Container>

          
       
    );
}

export default Home;