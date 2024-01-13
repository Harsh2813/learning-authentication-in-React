import React, {useState, useEffect} from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {

    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);//after refreshing page token set so that don't again login

    const userIsLoggedIn = !!token;//is reverse the truthy and falsy value like if token is empty string then it returns false if not empty then it returns true;

    let logoutTimer;//for automatic logout after 5 minute taken expiresIn as 300 second in AuthForm.js
    const userLoginHandler = (token, expiresIn) => {
        setToken(token);// fetch se login krke response data se token liye aur yha ye login fn call kiye fir token set ho gya same ab token me empty string ni h to userIsLoggedIn true ho gya.
        localStorage.setItem('token', token);


    // Set up a timer to automatically log out the user after the token expires here we taking after 5 minute logout
    logoutTimer = setTimeout(() => {
        userLogoutHandler();
      }, expiresIn * 1000); // expiresIn is in seconds, setTimeout takes milliseconds so 5 minute is 300 sec so 300 * 1000 is 300000 miliseconds which is 5 minute, so userLogoutHandler will run after this milisecond
  
      // Store the expiration time in local storage
      const expirationTime = Date.now() + expiresIn * 1000;//hm expire hone ka time store kr liye mtlb jo bhi abhi ka time h Date.now se suppose 12 bje h aur expiresIn 300 h * 1000 mtlb 5 min. to 12:05 12 bajke 5 minute ka time hmne expiratioTime le liya aur 12:05 ko localStorage me set kr diye taki refresh hone me countdown start
      localStorage.setItem('expirationTime', expirationTime);// na ho jaye wahi se timing shuru ho
    };
  
    const userLogoutHandler = () => {
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      
      // Clear the logout timer logout krne ke baad ab kuchh need ni local storage me
      clearTimeout(logoutTimer); 
    };
  
    useEffect(() => {
        //agar page refresh ya compo rerender hota h to hmari jo expire hone ka time tha wo get kiya storedExpirationTime me liya aur abhi ke time se use minus kr diya jaise 12:00 pe login hua to 12:03 me refresh hua page pr 12:05 hme expirationTime liya tha to ab Date.now se present time 12:03 ko minus kiya 12:05 se storedExpirationTime(12:05) - Date.now();(12:03) to hme 2 minute time bacha to remainig me le liye
      const storedExpirationTime = localStorage.getItem('expirationTime');
      const remainingTime = storedExpirationTime - Date.now();
  
      if (remainingTime > 0) {
        // ab jo remaining time bacha timer fir lga diye us bache hue time ke liye suppose 2 minute bacha tha to
        logoutTimer = setTimeout(() => {// 2 minute baad logout ho jayega
          userLogoutHandler();
        }, remainingTime);
      }
    }, []);
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