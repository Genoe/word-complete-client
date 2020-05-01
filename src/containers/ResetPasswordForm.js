import React, {Component} from 'react';
import {connect} from 'react-redux';
import {requestPasswordReset} from '../store/actions/auth';

class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            passwordConfirm: ''
        };
    }

    // When we use arrow functions, we don't need to bind in the constructor
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = e => {
        e.preventDefault();

        this.props.requestPasswordReset(this.state.email).then((msg) => {
            return;
        })
        .catch(() => {
            return;
        });
    };

    render() {
        const {email} = this.state;
        const {errors, history, removeError, match, notifications} = this.props;

        const emailInput = (
            <React.Fragment>
                <label htmlFor="email">Email:</label>
                <input 
                    className="form-control" 
                    id="email"
                    name="email" 
                    onChange={this.handleChange} 
                    value={email} 
                    type="text"
                />
            </React.Fragment>
        );

        const pwdInput = (
            <React.Fragment>
                <div className="alert alert-info">After submitting your new password, you will be redirected to the sign-in page.</div>
                <label htmlFor="password">Password:</label>
                <input 
                    className="form-control" 
                    id="password"
                    name="password" 
                    onChange={this.handleChange} 
                    type="password"
                />
                <label htmlFor="passwordConfirm">Please confirm your password:</label>
                <input 
                    className="form-control" 
                    id="passwordConfirm"
                    name="passwordConfirm" 
                    onChange={this.handleChange} 
                    type="password"
                />
            </React.Fragment>
        )

        history.listen(() => {
            removeError();
        });

        return (
            <div>
                <div className="row justify-content-md-center text-center">
                    <div className="col-md-6">
                        <form onSubmit={this.handleSubmit}>
                            <h2>Reset Your Password</h2>
                            {errors.message && (
                                <div className="alert alert-danger">{errors.message.map((err) => {
                                    return (<p>{err}</p>);
                                })}</div>
                            )}
                            {notifications.notification && (
                                <div className="alert alert-success">{notifications.notification.map((notification) => {
                                    return (<p>{notification}</p>);
                                })}</div>
                            )}
                            {match.params.token ? pwdInput : emailInput}
                            <br />
                        <button type="submit" className="btn btn-primary btn-block btn-lg">
                            Submit
                        </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errors,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps, {requestPasswordReset})(ResetPasswordForm);
