import Cookies  from 'universal-cookie';

const authTokenKey = 'accessToken';
const cookies = new Cookies();

export function setAuthCookie(token) {
    cookies.set(authTokenKey, token, {path: '/'});
}

export function getAuthToken() {
    return cookies.get(authTokenKey);
}

export default function isAuthenticated() {
    return !(getAuthToken() === null || getAuthToken() === undefined);
}
