import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Store from './store';
import { REDUX_STORE_NAME } from './config';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem(REDUX_STORE_NAME);
        if (serializedState === null) {
            return {};
        }
        return JSON.parse(serializedState);
    } catch (e) {
        return {};
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(REDUX_STORE_NAME, serializedState);
    } catch (e) {
        // Ignore write errors;
    }
};

const peristedState = loadState();
const store = Store(peristedState);
store.subscribe(() => {
    saveState(store.getState());
});

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
