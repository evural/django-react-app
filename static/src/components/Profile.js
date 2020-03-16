import React, {useState, useEffect} from "react";
import api from "../utils/api";

const Profile = props => {
	const [state, setState] = useState({user: {username:'', name:'', email:''}})

	useEffect( () => {
        const fetchData = async () => {
            const result = await api.get('/accounts/me');
            console.log(result.data);
            setState( state => ({
                ...state,
                user: result.data
            }));
        };
        fetchData()
        console.log(state);
    }, []);

	return (
        <p>{state.user.name}</p>
	);

}

export default Profile;
