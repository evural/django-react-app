import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import api from "../utils/api";
import Form from 'react-bootstrap/Form';

const TopicForm = props => {

	let history = useHistory();
	const [state, setState] = useState({
		topic: "",
		entry: ""
	});

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
        api.post('/api/v1/topics/', topic, {
	        headers: {
               'Accept' : 'application/json',
               'Content-Type': 'application/json'
            },
        }).then((response) => {
			history.push(`/topic/${response.data.pk}`);
        }, (error) => {
            console.log(error);
        }); 
	}

	return (
		<Form onSubmit={e => create_topic(e)}>
		  <Form.Group controlId="topicForm">
            <Form.Label>Topic</Form.Label>
		    <Form.Control 
		      type="text" 
		      placeholder="Topic"
		      name="topic"
              value={state.topic}
              onChange={handle_change} />
            <Form.Label>Entry</Form.Label>
            <Form.Control as="textarea" rows="5"
		      name="entry"
              value={state.entry}
              onChange={handle_change}/>
          </Form.Group>
		  <input type="submit" />
		</Form>
	);

}

export default TopicForm;
