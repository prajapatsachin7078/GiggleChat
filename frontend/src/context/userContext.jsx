import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);
        // console.log(userInfo)
        if(!userInfo){
            navigate('/login');
        }
    },[navigate])
    return (    
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
};



