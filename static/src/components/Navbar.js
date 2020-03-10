import React from "react";
import {Link, useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import Search from "./Search";
import {Button} from "react-bootstrap";
import './navbar.css'

const Navbar = props => {
	let history = useHistory();

	const handle_logout = e => {
		e.preventDefault();
        localStorage.removeItem('username');
        localStorage.removeItem('token');
		props.on_success_logout();
		history.push('/');
	}

    const logged_out_nav = (
        <ul className='list-unstyled'>
          <li>
            <Link to="/login">login</Link>
          </li>
          <li>
            <Link to="/signup">signup</Link>
          </li>
        </ul>
    );

    const logged_in_nav = (
        <ul className='list-unstyled'>
		  <li>
            <Link to="/topic/new">Create Topic</Link>
		  </li>
		  <li>
		    <Button variant="link" onClick={handle_logout}>logout</Button>
		  </li>
        </ul>
    );

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">urbanlib</Link>
          <Search />
          <div className='ml-auto'>
		    {props.logged_in ? logged_in_nav : logged_out_nav}
		  </div>
        </nav>
        );
}

Navbar.propTypes = {
    logged_in: PropTypes.bool.isRequired
};

export default Navbar;
