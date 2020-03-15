import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import qs from "qs";

import api from '../utils/api';
import isAuthenticated, { setAuthCookie } from '../utils/me';

const LoginForm = props => {
	let history = useHistory();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	// ToDo handle unsuccessful login
	const handle_unsuccessful_login = obj => {
        console.log(obj);
	};

    const handle_login = (e) => {
        e.preventDefault();
		const postData = {
            grant_type: 'password',
            username: username,
            password: password,
        };

		api.post('/accounts/login/', JSON.stringify(postData), {
			auth: {
				username: 'urbanlibinternal',
				password: 'urbanlibsecret'
			}
		}).then(function(response) {
            if (response.status === 400) {
				handle_unsuccessful_login(response.data);
            } else if (response.status === 404) {
                console.log(response.data);
            } else if (response.status === 200) {
                console.log(response);
				console.log(response.data.member.username);
				setAuthCookie(response.data.access_token);
				props.on_success_login(response.data.member.username);
		        history.push('/');
            }   
        }); 
    };


	const handle_change = e => {
		const name = e.target.name;
		const value = e.target.value;
		if (name === "username") {
			setUsername(value);
		}else if (name === "password") {
			setPassword(value);
		}
	};

    return (
		<form onSubmit={e => handle_login(e)}>
          <h4>Log In</h4>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handle_change}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handle_change}
          />
          <input type="submit" />
        </form>
	);
}

LoginForm.propTypes = {
    on_success_login: PropTypes.func.isRequired
};

export default LoginForm;
