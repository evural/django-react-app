import React, {useState, useEffect} from "react";
import api from "../utils/api";
import {NavLink} from "react-router-dom";
import "./Topic.css";
import {Button} from "react-bootstrap";

const Profile = props => {
	const [state, setState] = useState({user: {username:'', name:'', email:''}, entries: []})

	useEffect( () => {
        const fetchUserData = async () => {
            const result = await api.get('/accounts/me');
            console.log(result.data);
            setState( state => ({
                ...state,
                user: result.data
            }));
        };
		const fetchEntries = async () => {
            const result = await api.get('/api/entries/me');
			console.log(result.data);
            setState( state => ({
                ...state,
                entries: result.data.data
            }));
		};
        fetchUserData();
		fetchEntries();
    }, []);

	const deleteEntry = (e, entryId) => {
		e.preventDefault();
		console.log("delete entry: " + entryId);
		api.delete(`/api/entries/${entryId}`, {
            headers: {
               'Accept' : 'application/json',
               'Content-Type': 'application/json'
            },
        }).then((response) => {
			console.log(response)
        }, (error) => {
            console.log(error);
        });

	};

	return (
		<div>
          <h1>{state.user.name}</h1>
		  <h4>entries</h4>
		  <ul className="list-unstyled components">
              {state.entries.map(entry => (
                <li key={entry.pk}>
				  <h5>{entry.topic.text}</h5>
				  <div className="entry-content">{entry.text}</div>
				  <div className="entry-footer row">
                    <div className="feedback col-sm-4">
				      <NavLink to={"/entry/new/" + entry.pk}>Edit</NavLink>
                      <Button variant="link" size="sm" onClick={e => deleteEntry(e, entry.pk)}>
                        Delete
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
		</div>
	);

}

export default Profile;
