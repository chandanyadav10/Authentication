import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
   

    return (
        <UserContext.Provider value={"Hello from context"}>
            {children}
        </UserContext.Provider>
    );
};