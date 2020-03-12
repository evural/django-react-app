import React, {useEffect, useState} from "react";
import "./sidebar.css";
import {NavLink} from "react-router-dom";
import api from '../utils/api'


const TopicList = props => {

    const [state, setState] = useState({topics: []});

	useEffect( () => { 
		const fetchData = async () => {
		    const result = await api.get('/api/topics/');
		    console.log(result.data);
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
