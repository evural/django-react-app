import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";

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
		const data = {
			"username": username,
			"password": password
		};
        fetch('http://localhost:8000/token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
			credentials: 'include',
			withCredentials: true,
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status === 400) {
                response.json().then(function(object) {
					handle_unsuccessful_login(object);
                }) 
            } else if (response.status === 404) {
                response.json().then(function(object) {
                    console.log(object.type, object.message);
                }) 
            } else if (response.status === 200) {
                response.json().then(function(object) {
                    console.log(object);
					props.on_success_login(object.user.username);
		            history.push('/');
                })
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
