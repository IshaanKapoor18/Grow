import React, { useState } from "react";
import { Button, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import  axios  from "axios";
import { useHistory } from 'react-router-dom';
import Error_audio from "../../Image/error.mp3"

const Login = () => {
    
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState();
    const Error_found_sound = new Audio(Error_audio);
    const toast = useToast();
    const history = useHistory();

    const submithandle = async() => {
        setLoading(true);
        localStorage.removeItem("userInfo");
        
        if (!email || !password) {
            Error_found_sound.play()
            toast({
                title: "Please Fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type" : "application/json",
                },
            }
            const { data } = await axios.post("/grow/user/login", { email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            
            //  window.location.reload(false);
            
            // history.push("/chats")
            // history.push("/chats")

            let utterance = new SpeechSynthesisUtterance(`Welcom    ${data.name}`);

            speechSynthesis.speak(utterance);

            history.push("/chats")
            window.location.reload(false);
            
            
        }
        catch (error) {
            Error_found_sound.play()
            toast({
                title: "Password Or Email Incorrect",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

    return (
        <VStack spacing={3} color={"black"}>

            <FormControl isRequired id="Email">
                <FormLabel>
                    Email
                </FormLabel>

                <Input
                    color={"black"}
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={ (e)=>setEmail(e.target.value) }
                />
            </FormControl>

            <FormControl isRequired id="password">
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup>
                    <Input
                    type={ "password" }
                    color={"black"}
                        placeholder="Choose Password"
                        value={password}
                    onChange={ (e)=>setPassword(e.target.value) }
                    />
                </InputGroup>
                
            </FormControl>

            

            
                <Button colorScheme='teal' variant='ghost' marginTop={15} onClick={submithandle} color={"Red"} isLoading = {loading}>
                    Login
                </Button>
            <Button colorScheme='teal' variant='ghost' marginTop={15} onClick={() => {
                setEmail("Grow_Guest@Grow.com");
                setPassword("123");
            }} color={"blue"}
                borderRadius={"10px"}
                border={"1px"}
            >
                    Sign-in as a Guest User
                </Button>
        </VStack>
    );
}

export default Login;
