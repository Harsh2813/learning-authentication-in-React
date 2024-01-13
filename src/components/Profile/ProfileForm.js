import classes from './ProfileForm.module.css';
import React, {useContext, useRef} from 'react';
import AuthContext from '../../store/auth-context';

const ProfileForm = () => {

  const newPasswordRef = useRef('');
  const authCxt = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredPassword = newPasswordRef.current.value;
    //add validation

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBvM-vQJZQxYvIGdUL9Zgr-NPsIkZuPPXw', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCxt.token,
        password: enteredPassword,//set kr diye enteredpassword ko password me
        returnSecureToken: false,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update password');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // Handle successful response data
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update password');
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="6" ref={newPasswordRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
