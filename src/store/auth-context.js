import React, {useState} from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {

    const [token, setToken] = useState(null)

    const userIsLoggedIn = !!token;//is reverse the truthy and falsy value like if token is empty string then it returns false if not empty then it returns true;

    const userLoginHandler = (token) => {
        setToken(token);// fetch se login krke response data se token liye aur yha ye login fn call kiye fir token set ho gya same ab token me empty string ni h to userIsLoggedIn true ho gya.
    }
    const userLogoutHandler = () => {
        setToken(null);
    }

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login : userLoginHandler,
        logout: userLogoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;