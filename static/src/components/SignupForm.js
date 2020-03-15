import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import api from "../utils/api";
import isAuthenticated, { setAuthCookie } from '../utils/me';
import qs from "qs";

const SignupForm = props => {
	let history = useHistory();

	const [state, setState] = useState({username: '',
	                                    email: '',
	                                    name: '',
	                                    password: ''});
	// ToDo handle unsuccessful signup
	const handle_unsuccessful_signup = obj => {
        console.log(obj);
	};

    const handle_signup = (e) => {
        e.preventDefault();
		//const postData = {
		const postData = qs.stringify({
			"username": state.username,
			"email": state.email,
			"name": state.name,
			"password": state.password,
            //"grant_type": 'password',
		});

		console.log(postData);
        api.post('/accounts/', postData, {
			auth: {
                username: 'urbanlibinternal',
                password: 'urbanlibsecret'
            }
		}).then(function(response) {
			console.log(response);
            if (response.status === 400) {
				handle_unsuccessful_signup(response);
            } else if (response.status === 404) {
                console.log(response);
            } else if (response.status === 200) {
                console.log(response);
				setAuthCookie(response.data.access_token);
				props.on_success_login(state.username);
                history.push('/');
            }   
        }); 
    };


	const handle_change = e => {
        const value = e.target.value;
        setState({
            ...state,
            [e.target.name]: value
        });
    }

    return (
		<form onSubmit={e => handle_signup(e)}>
          <h4>Sign Up</h4>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handle_change}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={state.email}
            onChange={handle_change}
          />
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={handle_change}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handle_change}
          />
          <input type="submit" />
        </form>
	);
}

SignupForm.propTypes = {
    on_success_login: PropTypes.func.isRequired
};

export default SignupForm;
