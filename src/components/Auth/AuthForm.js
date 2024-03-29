import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const authCxt = useContext(AuthContext);

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const switchAuthModeHandler = () => {
    //hm bs form switch kr rhe state change krke input same h bcoz
    setIsLogin((prevState) => !prevState);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();

    const enteredMail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    //can add input's validation

    setIsLoading(true);
    let url; // same fetch method use krna h different url ke liye isiliye url ke liye taki uske acc. server work karega and hme jo Id token milta h. The token would be used in all the api calls after logging in so we need to store it smartly, so that it could be used
    if (isLogin) {
      //agar isLogin true hua matlab login form wale input submit hue to
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBvM-vQJZQxYvIGdUL9Zgr-NPsIkZuPPXw";
    } else {
      // agr isLogin false hua mtlb signUp wale page me to post kr denge input details of user
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBvM-vQJZQxYvIGdUL9Zgr-NPsIkZuPPXw";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredMail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        //is wale .then me agar response sahi ok h to json me return kiye else error throw kiye
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            //.json return promise so we have to use .then again after .json method
            //show error modal
            let errorMessage = "Authentication Failed!";
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }
            throw new Error(errorMessage); //ye hmne error throw krke niche .catch me handle kr liya
          });
        }
      })
      .then((data) => {
        authCxt.login(data.idToken, 300);//300 is second i.e. 5 minute to automatic logout after 5 min of login
        history.replace("/");
      }) //uper wale then se jo data aaya usko yha handle kiye login se
      .catch((err) => alert(err.message));
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
          {!isLoading && (
            <button type="submit">
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
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
