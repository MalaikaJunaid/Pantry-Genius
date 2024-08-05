import { createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const googleSignIn =() =>{
        const Provider= new GoogleAuthProvider()
        signInWithPopup(auth, Provider)
    }

    const logOut = () => {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe= onAuthStateChanged(auth, (currentUser) =>{
            setUser(currentUser)
        })
        return() => unsubscribe()
    }, [user])


    return (<AuthContext.Provider value={{ user, googleSignIn, logOut }}>{children}</AuthContext.Provider>)

}

export const UserAuth = () => {

    return useContext(AuthContext)
}
