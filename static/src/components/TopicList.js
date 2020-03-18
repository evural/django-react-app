import React, {useEffect, useState, useReducer} from "react";
import "./sidebar.css";
import {NavLink} from "react-router-dom";
import api from '../utils/api';
import Carousel from 'react-bootstrap/Carousel';
import {Button} from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


function reducer(state, action) {
	switch (action.type) {
		case 'init':
			return { 
				topics: action.payload.results, 
				count: action.payload.count,
				page: 1,
				limit: 10
			};
		case 'nextPage':
			return { 
				topics: action.payload.results, 
				count: action.payload.count,
				page: state.page+1,
				limit: 10
			};
		case 'prevPage':
			return { 
				topics: action.payload.results, 
				count: action.payload.count,
				page: state.page-1,
				limit: 10
			};
		default:
			return state;
	}
}

const TopicList = props => {

    const [state, dispatch] = useReducer(reducer, {topics: [], page:1, limit:10, count:0});
	useEffect( () => { 
		fetchData(state.limit, state.page, "init");
	}, []);

	const fetchData = async (limit, page, type) => {
		const response = await api.get(`/api/topics?limit=${limit}&page=${page}`);
		dispatch({ type: type, payload: response.data });
	};
	const changePage = (e, direction) => {
		e.preventDefault();
		if (direction == "prev"){
			if (state.page > 1){
				fetchData(state.limit-1, state.page-1, "prevPage");
			}
		}else if (direction == "next"){
			if (state.page * state.limit < state.count){
				fetchData(state.limit+1, state.page+1, "nextPage");
			}
		}
	}

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
		  <div className="sidebar-footer row">
            <div className="feedback col-sm-4">
              <Button variant="outline-secondary" size="sm" onClick={e => changePage(e, "prev")}>
                <FaChevronLeft />
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={e => changePage(e, "next")}>
                <FaChevronRight />
              </Button>
            </div>
          </div>
        </div>
        );

}

export default TopicList;
