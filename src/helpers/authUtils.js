import axios from 'axios';
import { REDUX_STORE_NAME } from '../config'

//============ Save User info in Local Storage =============*
const userSetInLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

//============ Gets the logged in user from Local Storage =============*
const userFromLocalStorage = () => {
    const currentStore = JSON.parse(localStorage.getItem(REDUX_STORE_NAME));
    const user = currentStore.Login.usuario;
    return user
}

//============ Check User Authenticated =============*
const isUserAuthenticated = () => {
    return userFromLocalStorage() !== null;
}

//============ Post for Login =============*
const postLogin = (url, data) => {
    return axios.post(url, data).then(response => {
        if (response.status === 400 || response.status === 500)
            throw response.data;
        return response.data;
    }).catch(err => {
        throw err[1];
    });
}

//============ Post for Registration =============*
const postRegister = (url, data) => {
    return axios.post(url, data).then(response => {
        if (response.status >= 200 || response.status <= 299)
            return response.data;
        throw response.data;
    }).catch(err => {
        var message;
        if (err.response && err.response.status) {
            switch (err.response.status) {
                case 404: message = "Sorry! the page you are looking for could not be found"; break;
                case 500: message = "Sorry! something went wrong, please contact our support team"; break;
                case 401: message = "Invalid credentials"; break;
                default: message = err[1]; break;
            }
        }
        throw message;
    });

}

//============ Post for Forget Password =============*
const postForgetPwd = (url, data) => {
    return axios.post(url, data).then(response => {
        if (response.status === 400 || response.status === 500)
            throw response.data;
        return response.data;
    }).catch(err => {
        throw err[1];
    });
}




export { userSetInLocalStorage, userFromLocalStorage, isUserAuthenticated, postRegister, postLogin, postForgetPwd }