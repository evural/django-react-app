import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import qs from "qs";
import Form from 'react-bootstrap/Form';

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
		<Form onSubmit={e => handle_login(e)}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control 
		      type="text" 
		      placeholder="Enter username"
		      name="username"
              value={username}
              onChange={handle_change} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
		      type="password" 
		      placeholder="Password"
		      name="password"
              value={password}
              onChange={handle_change}/>
          </Form.Group>
            <input type="submit" />
          </Form>
	);
}

LoginForm.propTypes = {
    on_success_login: PropTypes.func.isRequired
};

export default LoginForm;
