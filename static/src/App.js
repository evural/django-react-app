import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
//import {Button} from "react-bootstrap";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Navbar from "./components/Navbar";
import TopicForm from "./components/TopicForm";
import TopicList from "./components/TopicList";
import Topic from "./components/Topic";
import Home from "./pages/Home";
import "./index.css"

const App = () => {

    const [loggedIn, setLoggedIn] = useState(false);

	useEffect( () => {
		initialize();
	}, []);
	
	const initialize = () => {
		const username = localStorage.getItem('username');
		const loggedIn = !!username ? true : false;
		setLoggedIn(loggedIn);
	};

	const on_success_login = (username) => {
        localStorage.setItem('username', username);
		setLoggedIn(true);
	};

	const on_success_logout = () => {
		setLoggedIn(false);
	};

    return (
		<div className="container-fluid App">
		  <Router>
		    <Navbar logged_in={loggedIn} on_success_logout={on_success_logout} />
		    <div className="row">
		      <TopicList />
		      <div className="actual-content col-8">
		        <Switch>
		          <Route exact path='/'> 
		            <Home />
		          </Route>
		          <Route path='/login'>
		            <LoginForm on_success_login={on_success_login} />
		          </Route>
		          <Route path='/signup'>
		            <SignupForm />
		          </Route>
		          <Route exact path='/topic/new'>
		            <TopicForm />
		          </Route>
		          <Route path='/topic/:id'>
		            <Topic logged_in={loggedIn} />
		          </Route>
		        </Switch>
		      </div>
		    </div>
		  </Router>
	    </div>
    );

}

export default App;
