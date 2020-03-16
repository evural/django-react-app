import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import EntryForm from "./EntryForm";
import "./Topic.css";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import {Button} from "react-bootstrap";
import api from "../utils/api";

const Topic = props => {

	const [state, setState] = useState({topic:{text: '', entry_list:[]}});
	const [entrySaved, setEntrySaved] = useState(false);
	let {id} = useParams();

	useEffect( () => {
        const fetchData = async () => {
            const result = await api.get(`/api/topics/${id}`);
            setState( state => ({
                ...state,
                topic: result.data
            }));
			console.log(result.data);
        };
        fetchData()
    }, [id, entrySaved]);

	const entry_saved_callback = () => {
		setEntrySaved(!entrySaved);
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
		  <EntryForm loggedIn={props.logged_in} topicId={id} callback={entry_saved_callback}/>
		</div>
	);
}

export default Topic;
