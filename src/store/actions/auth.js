import {apiCall, setTokenHeader} from '../../services/api';
import {SET_CURRENT_USER} from '../actionTypes';
import {addError, removeError} from './errors';
import {addNotification, removeNotification} from './notifications';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    };
}

export function setAuthorizationToken(token) {
    setTokenHeader(token);
}

export function logout() {
    return dispatch => {
        localStorage.clear();
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
    }
}

export function authUser(type, userData) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall('post', `/api/auth/${type}`, userData).then(({token, ...user}) => {
                localStorage.setItem('jwtToken', token);
                setAuthorizationToken(token);
                dispatch(setCurrentUser(user));
                dispatch(removeError());
                resolve();
            })
            .catch(err => {
                dispatch(addError(err.message));
                reject(); // indicate the API call failed
            });
        });
    };
}

export function putNewUsername(newUsername) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const { currentUser } = getState();
            const id = currentUser.user.id;

            return apiCall('put', `/api/users/${id}/account`, {
                username: newUsername
            })
            .then(({token, ...user}) => {
                localStorage.setItem('jwtToken', token);
                setAuthorizationToken(token);
                dispatch(setCurrentUser(user));
                dispatch(removeError());
                resolve();
            })
            .catch(err => {
                dispatch(addError(err.message));
                reject(); // indicate the API call failed
            });
        })
    }
}

export function requestPasswordReset(email, captchaToken) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {

            return apiCall('post', `/api/auth/resetpassword`, {
                email,
                captchaToken,
            })
            .then(({message}) => {
                dispatch(addNotification(message));
                dispatch(removeError());
                resolve(message);
            })
            .catch(err => {
                dispatch(removeNotification());
                dispatch(addError(err.message));
                reject(); // indicate the API call failed
            });
        })
    }
}

export function resetPassword(token, password, passwordConfirm, captchaToken) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {

            return apiCall('put', `/api/auth/resetpassword`, {
                token,
                password,
                passwordConfirm,
                captchaToken,
            })
            .then(({message}) => {
                dispatch(logout()); // user needs to re-login with their new password
                dispatch(removeError());
                resolve(message);
            })
            .catch(err => {
                dispatch(removeNotification());
                dispatch(addError(err.message));
                reject(); // indicate the API call failed
            });
        })
    }
}
