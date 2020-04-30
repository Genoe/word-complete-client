import {ADD_NOTIFICATION, REMOVE_NOTIFICATION} from '../actionTypes';

export const addNotification = notification => ({
    type: ADD_NOTIFICATION,
    notification,
});

export const removeNotification = () => ({
    type: REMOVE_NOTIFICATION
});
