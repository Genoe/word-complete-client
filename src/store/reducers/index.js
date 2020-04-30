import { combineReducers } from 'redux';
import currentUser from './currentUser';
import errors from './errors';
import notifications from './notifications';

const rootReducer = combineReducers({
    currentUser,
    errors,
    notifications
});

export default rootReducer;
