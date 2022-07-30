export const API_SERVER_ENDPOINT_BASE = process.env.REACT_APP_API_SERVER_ENDPOINT_BASE;
// export const API_SERVER_ENDPOINT_BASE = 'http://192.168.1.19:4000';
export const AUTH_TOKEN_KEY_NAME = process.env.REACT_APP_AUTH_TOKEN_KEY_NAME;
export const REDUX_STORE_NAME = process.env.REACT_APP_REDUX_STORE_NAME;
export const Endpoint = endpoint => API_SERVER_ENDPOINT_BASE + endpoint;

export const PublicHeaders = () => new Headers({
    'Content-Type': 'application/json'
});

export const PrivateHeaders = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY_NAME) || '';
    return new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    })
}

export const PrivateFileHeaders = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY_NAME) || '';
    return new Headers({
        'Authorization': `Bearer ${token}`
    })
}