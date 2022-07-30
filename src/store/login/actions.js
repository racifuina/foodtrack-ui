import { SET_CURRENT_USER } from './actionTypes';

export const logout = () => {
    return dispatch => {
        return dispatch({
            type: SET_CURRENT_USER,
            usuario: null
        })
    }
}

export const setCurrentUser = (usuario) => {
    return dispatch => {
        return dispatch({
            type: SET_CURRENT_USER,
            usuario
        })
    }
}
