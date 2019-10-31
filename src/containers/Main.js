import React from 'react';
import {Switch, Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import Homepage from '../components/Homepage';
import AuthForm from '../components/AuthForm';
import {authUser} from '../store/actions/auth';
import {removeError} from '../store/actions/errors';
import withAuth from '../hocs/withAuth';
import AccountForm from './AccountForm';

const Main = props => {
    const {authUser, errors, removeError, currentUser} = props;

    return (
        <div className="container">
            <Switch>
                <Route
                    exact path="/"
                    render={props => <Homepage currentUser={currentUser} {...props} />}
                />

                <Route exact path="/signin" render={props => {
                    return (
                        <AuthForm 
                            removeError={removeError}
                            onAuth={authUser} 
                            errors={errors} 
                            buttonText="Log in" 
                            heading="Welcome Back." 
                            {...props} 
                        />
                    );
                }} />

                <Route exact path="/signup" render={props => {
                    return (
                        <AuthForm 
                            removeError={removeError}
                            onAuth={authUser} 
                            errors={errors} 
                            signUp 
                            buttonText="Sign me up!"
                            heading="Join Word Complete today." 
                            {...props} 
                        />
                    );
                }} />
                <Route
                    path="/users/:id/account"
                    component={(withAuth(AccountForm))}
                />       
            </Switch>
        </div>
    );
}

// Homepage will either render a landing page or send the logged in user to a new game
// currentUser and errors get added to the props of the Main component
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        errors: state.errors
    };
}

export default withRouter(connect(mapStateToProps, {authUser, removeError})(Main));