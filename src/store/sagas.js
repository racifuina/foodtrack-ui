import { all } from 'redux-saga/effects'
import accountSaga from './auth/register/saga';
import loginSaga from './auth/login/saga';
 import forgetSaga from './auth/forgetpwd/saga';

export default function* rootSaga() {
    yield all([ accountSaga(), loginSaga(), forgetSaga()]);
}