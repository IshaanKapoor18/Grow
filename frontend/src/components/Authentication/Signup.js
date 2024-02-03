import React, { useState } from "react";
import { Button, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import  axios  from "axios";
import { useHistory } from 'react-router-dom';
import Error_audio from "../../Image/error.mp3"


const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirm, setConfirm] = useState();

    const [pic, setpic] = useState("");
    const [show, setShow] = useState(false);
    const toast = useToast()
    const history = useHistory()
    const [loading, setLoading] = useState(false);
    const Error_Sound_found = new Audio(Error_audio);
    

    const click = () => setShow(!show);
    
    const submithandle = async() => {
        setLoading(true);
        const check = email.toString();
        console.log(`The value of Check - ${check}`);
        if (!check.includes("@") || !check.includes(".")) {
            Error_Sound_found.play();
            toast({
                title: "Please Give a valid email",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }


        if (!name || !email || !password || !confirm) {
            Error_Sound_found.play();
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
        
        if (password !== confirm) {
            Error_Sound_found.play();
            toast({
                title: "Password Did not match",
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
            
            const { data } = await axios.post("/grow/user", { name, email, password, pic }, config);
            
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.removeItem("userInfo");
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            
             speechSynthesis.cancel();

            let utterance = new SpeechSynthesisUtterance("Welcome to  Grow");

            speechSynthesis.speak(utterance);
            console.log("Signin");
            console.log(pic);
            history.push('/chats')
            window.location.reload(false);
        } catch (error) {
            Error_Sound_found.play();
            const config = {
                headers: {
                    "Content-type" : "application/json",
                },
            }
            const { data } = await axios.post("/grow/user/login", { email, password }, config);
            if (data) {
                Error_Sound_found.play();
                toast({
                title: "User already exist",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
            }
            Error_Sound_found.play();
            toast({
                title: "Something went wrong..",
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

    const Picdetails = async(pics) => {
        setLoading(true);
        if (pics === undefined) {
            Error_Sound_found.play();
            toast({
                    title: 'Please Select an Image.',
                    description: "We've created your account for you.",
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: "buttom",
            })
            return null;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "growapp");
            data.append("cloud_name", "dplewko42");
            fetch("https://api.cloudinary.com/v1_1/dplewko42/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((d) => {
                    
                   
                   
                    setpic(d.url.toString())
                    
                   
                   
                    pic = d.url.toString();
                    console.log("---");
                   
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            Error_Sound_found.play();
            toast({
                    title: 'Please Select an Image.',
                    description: "We've created your account for you.",
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: "buttom",
            })
            return null;
        }
    };



    return (

        <VStack spacing={3} color={"black"}>
            <FormControl isRequired id="Name">
                <FormLabel>
                    Name
                </FormLabel>

                <Input
                    color={"black"}
                    placeholder="Enter Your Name"
                    onChange={ (e)=>setName(e.target.value) }
                />
            </FormControl>

            <FormControl isRequired id="Email">
                <FormLabel>
                    Email
                </FormLabel>

                <Input
                    
                    color={"black"}
                    placeholder="Enter Your Email"
                    onChange={ (e)=>setEmail(e.target.value) }
                />
            </FormControl>

            <FormControl isRequired id="password">
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup>
                    <Input
                    type={ show? "text" : "password" }
                    color={"black"}
                    placeholder="Choose Password"
                    onChange={ (e)=>setPassword(e.target.value) }
                    />
                </InputGroup>
                
            </FormControl>

            <FormControl isRequired id="Confirm">
                <FormLabel>
                    Confirm Password
                </FormLabel>
                <InputGroup>
                    <Input
                    type={ show? "text" : "password" }
                    color={"black"}
                    placeholder="Enter your Password Again "
                    onChange={ (e)=>setConfirm(e.target.value) }
                    />
                    <InputRightElement width={"4.5rem"}>
                        <Button h="1.55rem" size={"sm"} onClick={click}>
                            {show ? "Hide" : "Check"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                
            </FormControl>

            <FormControl isRequired id="pic">
                <FormLabel>
                    Upload profile picture
                </FormLabel>
              
                    <Input
                    type="file"
                    color={"black"}
                    accept="image/*"
                    p={1}
                    onChange={ (e)=>Picdetails(e.target.files[0]) }
                    />
                
                </FormControl>
            <Button
                colorScheme='teal' 
                variant='ghost'
                marginTop={15}
                onClick={submithandle}
                color={"green"}
                isLoading={loading}
            >
                    Create Account
                </Button>
        </VStack>
    );
}

export default Signup;
