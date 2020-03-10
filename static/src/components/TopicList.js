import React, {useEffect, useState} from "react";
import axios from "axios";
import "./sidebar.css";
import {NavLink} from "react-router-dom";


const TopicList = props => {

	const API_URL = 'http://localhost:8000';

    const [state, setState] = useState({topics: []});

	useEffect( () => { 
		const url = `${API_URL}/api/topics/`;
		const fetchData = async () => {
		    const result = await axios(url);
		    console.log(result.data.data);
			setState(state => ({
				...state, 
				topics: result.data.data
			}));
		};
		fetchData()
	}, []);

    return (
        <div className="wrapper col-3">
          <nav id="sidebar" className="navbar-light bg-light">
		    <div className="sidebar-header">
              <h3>Topics</h3>
            </div>
            <ul className="list-unstyled components">
              {state.topics.map(topic => (
                <li key={topic.pk}><NavLink to={"/topic/" + topic.pk}>{topic.text}</NavLink></li>
              ))}
            </ul>
          </nav>
        </div>
        );

}

export default TopicList;
