import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../context/chatProvider'
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../config/chatLogics'
import { Tooltip, Avatar } from '@chakra-ui/react'

const ScrollableChat = ({ message }) => {
    const { user } = ChatState();
    
    return (
        <ScrollableFeed>
            {message && message.map((m, i) => (
                <div style={{display: "flex"}} key={m._id}>
                    {(isSameSender(message, m, i, user._id) ||
                      isLastMessage(message, i, user._id)
                    ) && (
                        <Tooltip
                            label={m.sender.name}
                            placement='bottom-start'
                            hasArrow
                        >
                            <Avatar mt="7px" mr={1} size={"sm"} cursor={"pointer"} src={m.sender.pic} />
                          

                        </Tooltip>
                        
                        )}
                    
                    <span
                        style={
                                {
                                    backgroundColor: `${m.sender._id === user._id ? "rgb(146, 252, 199)" : "white"}`,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    marginLeft: isSameSenderMargin(message, m, i, user._id),
                                    marginTop: isSameUser(message, m, i, user._id) ? 3 : 10       
                                }
                            }
                    >
                            {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat;
