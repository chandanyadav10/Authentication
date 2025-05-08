"use client"

import React from "react";
import {UserContextProvider }from "../context/user.context";

interface Props {
    children: React.ReactNode;
}

export default function UserProvider({children}:any){
    return(
        <UserContextProvider>
            {children}
        </UserContextProvider>
    )
}