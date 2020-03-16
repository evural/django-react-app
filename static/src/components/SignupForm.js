import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import api from "../utils/api";
import isAuthenticated, { setAuthCookie } from '../utils/me';
import qs from "qs";
import Form from 'react-bootstrap/Form';
import { Col } from 'react-bootstrap';

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
		const postData = {
			"username": state.username,
			"email": state.email,
			"name": state.name,
			"password": state.password,
            "grant_type": 'password'
		};

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
		<Form onSubmit={e => handle_signup(e)}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control 
		        type="email" 
		        placeholder="Enter email"
		        name="email"
                value={state.email}
                onChange={handle_change} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control 
		        type="text" 
		        placeholder="Enter username"
		        name="username"
                value={state.username}
                onChange={handle_change}/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Name</Form.Label>
              <Form.Control 
		        type="text" 
		        placeholder="Name" 
		        name="name"
                value={state.name}
                onChange={handle_change} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
		        type="password" 
		        placeholder="Password"
		        name="password"
                value={state.password}
                onChange={handle_change} />
            </Form.Group>
          </Form.Row>
          <input type="submit" />
        </Form>
	);
}

SignupForm.propTypes = {
    on_success_login: PropTypes.func.isRequired
};

export default SignupForm;
