import { takeEvery, fork, put, all, call } from 'redux-saga/effects';
//============ Redux States for Login =============*
import { CHECK_LOGIN } from './actionTypes';
import {  apiError, loginUserSuccessful } from './actions';
//============ Authentication Functions =============*
import { userSetInLocalStorage,postLogin } from '../../../helpers/authUtils';

//============ Dispatch Redux Actions directly =============*
function* loginUser({ payload: { email, password, history } }) {
    try {
        const response = yield call(postLogin, '/post-login', {email: email, password: password});
            userSetInLocalStorage(response);
            yield put(loginUserSuccessful(response));
        history.push('/dashboard');
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser)
}

function* loginSaga() {
    yield all([fork(watchUserLogin)]);
}

export default loginSaga;