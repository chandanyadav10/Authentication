"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";

const UserContext = createContext();

// set axios to include credentials with every request
axios.defaults.withCredentials = true

export const UserContextProvider = ({ children }) => {
    const serverUrl = "http://localhost:8000";

    const router = useRouter();

    const [user, setUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
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

// get user loggedIn status
const userLoginStatus = async () => {
    let loggedIn = false;
    try {
        const res = await axios.get(`${serverUrl}/api/v1/login-status`,{
            withCredentials: true
        });

        loggedIn = !!res.data;
        setLoading(false);
if(!loggedIn){
          router.push("/login");
        }
        
    } catch (error) {
        console.log("Error getting login status",error);
        
    }
    console.log("user logged in status",loggedIn);
        
    return loggedIn;  
}

// logout user
const logoutUser = async () => {
    try {
        const res = await axios.get(`${serverUrl}/api/v1/logout`,{
            withCredentials: true
        });
        console.log(res);
        router.push("/login");
    } catch (error) {
        console.log("Error logging out user",error);
        
    }
}

// get user
const getUser = async () => {
    try {
        const res = await axios.get(`${serverUrl}/api/v1/user`,{
            withCredentials: true
        });
        console.log(res.data);
        setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });
      setLoading(false);
    } catch (error) {
        console.log("Error getting user",error);
        setLoading(false);
      toast.error(error.response.data.message);
    }
}

// Update user detail

const updateUser = async (e, data) => {
    e.preventDefault();

    setLoading(true);

    try {
        const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
            withCredentials: true // include cookies in the request
        })

        //update the userState

        setUser((prevState) => {
            return {
              ...prevState,
              ...res.data,
            };
          });

        toast.success("User updated successfully !");

        setLoading(false);
        
    } catch (error) {
        console.log("Error updating user",error);
        setLoading(false);
        toast.error(error.response.data.message);
        
    }
}

// email verification

const emailVerification = async() =>{
    setLoading(true);

    try {
        const res = axios.post(`${serverUrl}/api/v1/verify-email`,{},{
            withCredentials: true
        });

        console.log(res);

        toast.success("Email verified successfully !");

        setLoading(false);
        
    } catch (error) {
        console.log("Error verifying email",error);
        setLoading(false);
        toast.error(error.response.data.message);
        
    }
}

// verify user email
const verifyUser = async (token) =>{
    setLoading(true);

    try {
        const res = axios.post(`${serverUrl}/api/v1/verify-user/${token}`,{},{
            withCredentials: true
        })

        toast.success("User verified successfully !");

          setLoading(false);

        // redirect to home
        router.push("/");
      

    } catch (error) {
        console.log("Error verifying user",error);
        setLoading(false);
        toast.error(error.response.data.message);
    }
}

// forgot password email
const forgotPasswordEmail = async (email) => {
    setLoading(true);
    try {
        const res = await axios.post(`${serverUrl}/api/v1/forgot-password`,{
            email,
        },{
            withCredentials: true
        });

        console.log(res);
        toast.success("Email sent successfully !");

        setLoading(false);

        } catch (error) {
            console.log("Error sending email",error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
}

// reset password
const resetPassword = async (token,password) => {
    setLoading(true);
    try {
        const res = await axios.post(`${serverUrl}/api/v1/reset-password/${token}`, {
            password,
        },{
            withCredentials: true
        });

        console.log(res);
        toast.success("Password reset successfully !");

        setLoading(false);
        
        // redirect to login 
        router.push("/login");

        } catch (error) {
            console.log("Error resetting password",error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
}

// change password
const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
        const res = await axios.patch(`${serverUrl}/api/v1/change-password`,{ currentPassword, newPassword },{
            withCredentials: true
        });
        
        console.log(res);
        toast.success("Password changed successfully !");

        setLoading(false);
        
        

        } catch (error) {
            console.log("Error changing password",error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
}

// get all users
const getAllUsers = async () => {
    setLoading(true)
    try {
        const res = await axios.get(`${serverUrl}/api/v1/admin/users`,{},{
            withCredentials : true,
        })
        console.log(res);
        setAllUsers(res.data);
        setLoading(false)
        
    } catch (error) {
        console.log("Error getting all users", error);
        setLoading(false);
        toast.error(error.response.data.message)
    }
}

// delete user
const deleteUser = async (id) => {
    setLoading(true)
    try {
        const res = await axios.delete(`${serverUrl}/api/v1/admin/user/${id}`,{},{
            withCredentials : true,
        })
        console.log(res);
        toast.success("User deleted successfully !")
        getAllUsers();
        setLoading(false)
        
    } catch (error) {
        console.log("Error deleting user", error);
        setLoading(false);
        toast.error(error.response.data.message)
    }
}
        

// dynamic form handler
    const handlerUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => ({
        ...prevState,
        [name]: value, 
    }));
    };


    useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();

      if (isLoggedIn) {
        await getUser();
      }
    };

    loginStatusGetUser();
  }, []);

  useEffect(() =>{
    if(user.role === "admin"){
        getAllUsers();
    }
  }, [user.role])

    return (
        <UserContext.Provider value={{
            registerUser, 
            userState, 
            handlerUserInput, 
            loginUser,
            logoutUser, 
            user, 
            userLoginStatus, 
            updateUser, 
            emailVerification, 
            verifyUser, 
            forgotPasswordEmail,
            resetPassword,
            changePassword,
            allUsers,
            deleteUser
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
  return useContext(UserContext);
};