import {REMOVE_NOTIFICATION, ADD_NOTIFICATION} from '../actionTypes';

export default (state = {notification: null}, action) => {
    switch(action.type) {
        case ADD_NOTIFICATION:
            return {...state, notification: action.notification};
        case REMOVE_NOTIFICATION:
            return {...state, notification: null };
        default:
            return state;
    }
};
