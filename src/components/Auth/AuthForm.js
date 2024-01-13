import { useState, useRef } from "react";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();

    const enteredMail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    //can add input's validation

    setIsLoading(true);
    if (isLogin) {
      //agar isLogin true hua matlab login form wale input submit hue to
    } else {
      // agr isLogin false hua mtlb signUp wale page me to post kr denge input details of user
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBvM-vQJZQxYvIGdUL9Zgr-NPsIkZuPPXw",
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredMail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {'Content-Type': 'application/json'}
        }
      ).then((res) =>{
        setIsLoading(false);
        if(res.ok){
          console.log('ok')
        }else{
          return res.json().then((data) =>{
            //show error modal
            let errorMessage = 'Authentication Failed!';
            if(data && data.error && data.error.message){
              errorMessage = data.error.message;
            }
            alert(errorMessage);
          })
        }
      })
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={formSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={passwordRef} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
