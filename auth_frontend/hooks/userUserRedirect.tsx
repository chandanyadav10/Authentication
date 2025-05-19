"use client";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import {useEffect} from "react";

const useRedirect = (redirect: string) => {
    const {userLoginStatus} = useUserContext();
    const router = useRouter();
    useEffect(() => {
       const redirectUser = async () => {
         try {
            const isLoggedUser = await userLoginStatus();
            console.log(isLoggedUser);
            
            if(isLoggedUser){
                router.push(redirect);
            }
         } catch (error) {
            console.log("Error redirecting user",error);
         }  
       }
    }, [redirect, userLoginStatus, router]);
    
};

export default useRedirect;