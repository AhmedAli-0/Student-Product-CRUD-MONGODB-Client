import React, { useState, createContext, useContext } from 'react'

const SelectDataContext = createContext();

export default function AuthContextProvider({ children }) {

    const [selectedData, setSelectedData] = useState("student");

    return (

        <SelectDataContext.Provider value={{ selectedData, setSelectedData }}>
            {children}
        </SelectDataContext.Provider>
    )
}

export const useSelectDataContext = () => useContext(SelectDataContext);
