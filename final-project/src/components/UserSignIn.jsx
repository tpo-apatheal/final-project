import React, { useContext, useRef, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Context from '../context';
import api from '../utils/api.js';
import {useSpring, animated } from 'react-spring';


const UserSignIn = props => {

    const fade = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        },
       config: { duration: 3000 }
    });

  const history = useHistory();
  // send to the prev path if it was passed // otherwise send home //
  const { from } = props.location.state || { from: { pathname: '/' } }
  const { value, value: { actions: { asyncHandler, setUser } } } = useContext(Context);

  useEffect(() => {
    if(value.user.authenticated === true) {
       history.push(from)
    }
    // eslint-disable-next-line
  }, [value.user.authenticated])

  const emailInput = useRef('');
  const passwordInput = useRef('');

  const setCookies = async () => {
    const encodedPassword = btoa(passwordInput.current.value)
    const response = await api.getUser('users', emailInput.current.value, encodedPassword);
    const { data: { id, name, email } } = response;
    
    setUser({
      authenticated: true,
      id,
      email,
      userName: name,
      password: encodedPassword,
    });

    history.push(from);
  }

  const onSubmit = e => {
    e.preventDefault();
    asyncHandler(setCookies);
  }

  return (
    <>
      <main>
        <animated.div className="container" style={fade} >
            <div className="col-md-4 col-md-offset-4">
                <div className="form--centered">
                    <h2 id="uc-heading">Sign In</h2>
                    {value.error ? <h3 id="error">{value.error}</h3> : null}
                    <form className="signinform" onSubmit={onSubmit}>
                        <label htmlFor="emailAddress">Email Address</label>
                        <input className="signinform" id="emailAddress" name="emailAddress" type="email" ref={emailInput} />
                        <label htmlFor="password">Password</label>
                        <input className="signinform" id="password" name="password" type="password" ref={passwordInput} />
                        <div className="buttonsDiv">
                        <button className="buttons" type="submit">Sign In</button>
                        <NavLink to="/"><button className="buttons">Cancel</button></NavLink>
                        </div>
                    </form>
                    <p className="txt-footer">Don't have a user account? <br/> Click here to <NavLink className="signup-link" to="/signup">sign up</NavLink>!</p>
                </div>
            </div>  
        </animated.div>
      </main>
    </>
  );
}

export default UserSignIn;