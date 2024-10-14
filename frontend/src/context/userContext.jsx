import axios from "axios";
import { createContext, useEffect, useState } from "react";

const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);
    }, [])
    return (
        <UserContext.Provider value={{ user, setUser, chats, setChats, selectedChat, setSelectedChat }}>
            {children}
        </UserContext.Provider>
    )
};

export default UserContext;


