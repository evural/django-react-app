import axios from 'axios';
import { getAuthToken } from './me';

const api_url = url => {
	const API_URL = 'http://localhost:8000';
	//return `api-1.0${url}`;
	const res = `${API_URL}${url}`;
	console.log(res)
	return res;
};

const getRequestHeader = config => {
    const authToken = getAuthToken();
    if(authToken) {
        return {
            ...config,
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }
    }
    return config;
};

const api = {
    get: (url, config = {}) => {
        return axios.get(api_url(url), getRequestHeader(config));
    },
    post: (url, data = {}, config = {}) => {
        return axios.post(api_url(url), data, getRequestHeader(config));
    },
    patch: (url, data = {}, config = {}) => {
        return axios.patch(api_url(url), data, getRequestHeader(config));
    },
    delete: (url, config = {}) => {
        return axios.delete(api_url(url), getRequestHeader(config));
    }
};

export default api;
