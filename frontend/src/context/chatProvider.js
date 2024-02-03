import { createContext, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setselectedChat] = useState();
    const [chats, setchats] = useState([]);
    const [notification, setnotification] = useState([]);
      const history = useHistory();
    useEffect(() => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        
        
        // if (!user && !userInfo ) {
        //     localStorage.removeItem("userInfo");
        //     history.push('/')
        // }
    }, [history])

    return (
        <ChatContext.Provider value={{user, setUser, selectedChat, setselectedChat, chats, setchats, notification, setnotification}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    
   return  useContext(ChatContext);
}


export default ChatProvider;