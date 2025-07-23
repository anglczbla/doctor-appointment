import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const calculateAge = (dob) =>{
        const today = new Date()
        const birtDate = new Date(dob)

        let age = today.getFullYear() - birtDate.getFullYear()
        return age
    }
    const value = {
        calculateAge
    }
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider