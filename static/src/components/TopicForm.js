import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";


const TopicForm = props => {

	let history = useHistory();
	const [state, setState] = useState({
		topic: "",
		entry: ""
	});
	const API_URL = 'http://localhost:8000';

	const handle_change = e => {
        const value = e.target.value;
		setState({
			...state,
			[e.target.name]: value
		});
	}

	const create_topic = e => {
		e.preventDefault()
		const topic = {
			'text': state.topic,
			'entry_list': [{'text': state.entry}]
		}
        const url = `${API_URL}/api/topics/`;
        axios.post(url, topic, {
	        headers: {
               'Accept' : 'application/json',
               'Content-Type': 'application/json'
            },
			withCredentials: true
        }).then((response) => {
			history.push(`/topic/${response.data.pk}`);
        }, (error) => {
            console.log(error);
        }); 
	}

	return (
		<form onSubmit={e => create_topic(e)}>
          <h4>Create Topic</h4>
		  <label htmlFor="topic">Topic</label>
		  <input
              type="text"
              name="topic"
              value={state.topic}
              onChange={handle_change}
          />
	  	  <label htmlFor="entry">Entry</label>
          <textarea
            className="form-control"
            name="entry"
		    value={state.entry}
		    onChange={handle_change}
		    maxLength={5000}
            rows="5"
          />
		  <input type="submit" />
		</form>
	);

}

export default TopicForm;
