import React, {useState, useEffect, useReducer} from "react";
import {useParams} from "react-router-dom";
import EntryForm from "./EntryForm";
import "./Topic.css";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import {Button} from "react-bootstrap";
import api from "../utils/api";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function reducer(state, action) {
    switch (action.type) {
        case 'init':
            return {
				topic: action.payload,
				page: 1,
				limit: 10
            };
        case 'nextPage':
            return {
                topic: action.payload,
                page: state.page+1,
                limit: 10
            };
        case 'prevPage':
            return {
                topic: action.payload,
                page: state.page-1,
                limit: 10
            };
        default:
            return state;
    }
}

const Topic = props => {

	const [state, dispatch] = useReducer(reducer, {topic:{text: '', entry_list:[]}, page:1, limit:10});
	const [entrySaved, setEntrySaved] = useState(false);
	let {id} = useParams();

	useEffect( () => {
        fetchData(10, 1, "init");
    }, [id, entrySaved]);

    const fetchData = async (limit, page, type) => {
        const response = await api.get(`/api/topics/${id}?limit=${limit}&page=${page}`);
		dispatch({ type: type, payload: response.data });
    };

	const entry_saved_callback = () => {
		setEntrySaved(!entrySaved);
	};

    const changePage = (e, direction) => {
		e.preventDefault();
        if (direction == "prev"){
            if (state.page > 1){
                fetchData(state.limit-1, state.page-1, "prevPage");
            }
        }else if (direction == "next"){
            fetchData(state.limit+1, state.page+1, "nextPage");
        }
	};

	return (
		<div>
		  <h2>{state.topic.text}</h2>
		  <ul className="list-unstyled components entry-item-list">
            {state.topic.entry_list.map(entry => (
              <li key={entry.pk} className="entry-item">
                <div className="entry-content">{entry.text}</div>
				<div className="entry-footer row">
				  <div className="feedback col-sm-4">
				    <Button variant="outline-secondary" size="sm">
				      <FaThumbsUp />
				    </Button>
				    <Button variant="outline-secondary" size="sm">
				      <FaThumbsDown />
				    </Button>
				    </div>
				    <div className="info ml-auto col-sm-4">
				      <span className="font-weight-light">{entry.created_at}
				      </span> <span>{entry.author}</span>
				    </div>
				</div>
			  </li>
            ))}
          </ul>
		  <div className="entry-footer row">
            <div className="feedback col-sm-4">
              <Button variant="outline-secondary" size="sm" onClick={e => changePage(e, "prev")}>
                <FaChevronLeft />
              </Button>
		    </div>
            <div className="feedback col-sm-4">
              <Button variant="outline-secondary" size="sm" onClick={e => changePage(e, "next")}>
                <FaChevronRight />
              </Button>
            </div>
          </div>
		  <EntryForm loggedIn={props.logged_in} topicId={id} callback={entry_saved_callback}/>
		</div>
	);
}

export default Topic;
