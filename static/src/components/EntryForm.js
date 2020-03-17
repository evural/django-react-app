import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import api from "../utils/api";

const EntryForm = props => {

	let history = useHistory();
	const [entry, setEntry] = useState({text: ''});
	const isLoggedIn = props.loggedIn;
	const topicId = props.topicId;

	const create_entry = e => {
		e.preventDefault();
		const entry_data = {
            'text': entry.text,
            'topic': topicId
        }
        api.post('/api/entries/', entry_data, {
            headers: {
               'Accept' : 'application/json',
               'Content-Type': 'application/json'
            },
        }).then((response) => {
			setEntry({
				...entry,
				text: ''
			});
			props.callback();
        }, (error) => {
            console.log(error);
        });
	}

	const handle_change = e => {
		const value = e.target.value;
		setEntry({
			...entry,
			[e.target.name]:value
		});
	}

	if (isLoggedIn) {
		return (
			<form onSubmit={e => create_entry(e)}>
              <label htmlFor="entry">Entry</label>
              <textarea
                className="form-control"
                name="text"
                value={entry.text}
                onChange={handle_change}
                maxLength={5000}
                rows="5"
              />
              <input type="submit" />
            </form>
		)
	}else{
		return (
			<p>Log in to comment</p>
		)
	}

}

export default EntryForm;
