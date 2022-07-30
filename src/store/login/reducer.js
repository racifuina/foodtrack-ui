import { SET_CURRENT_USER } from './actionTypes';

const initialState = {
    usuario: null,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                usuario: action.usuario
            };
        default:
            return state;
    }
}