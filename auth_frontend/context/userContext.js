import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const serverUrl = "http://localhost:8000";

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
// register new user

const registerUser = async (e) => {
    e.preventDefault();
    if(!userState.name || !userState.email.includes("@") || !userState.password){
        toast.error("All fields are required !")
        return;
    }

    if(userState.password.length<6){
        toast.error("Password shold alteast 6 characters !")
        return;
    }

    try {
        const res = await axios.post(`${serverUrl}/api/v1/register`, userState);

        console.log(res);
        toast.success("User registered successfully !");

        //clear the form
        setUserState({
            name: "",
            email: "",
            password: "",
        });

        // redirect to login
        router.push("/login");
    } catch (error) {
        console.log("Error registering user",error);
        toast.error("Error registering user");
    }
}

// login user
const loginUser = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${serverUrl}/api/v1/login`, {
            email: userState.email,
            password: userState.password
        },{
            withCredentials: true
        });

        console.log(res);
        toast.success("User logged in successfully !");

        // clear the form
        setUserState({
            email: "",
            password: "",
        });
        // redirect to home
        router.push("/");
        
    } catch (error) {
        console.log("Error logging in user",error);
        toast.error("Error logging in user");
        
    }
}
     // dynamic form handler
     const handlerUserInput = (name) => (e) => {
        const value = e.target.value;

        setUserState((prevState) => ({
            ...prevState,
            [name]: value, 
        }));
    }
    return (
        <UserContext.Provider value={{registerUser, userState, handlerUserInput, loginUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
  return useContext(UserContext);
};