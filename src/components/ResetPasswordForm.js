import React, {Component} from 'react';

export default class ResetPasswordForm extends Component {
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
        const token = new URL(document.location).searchParams.get('token');
        const {password, passwordConfirm} = this.state;
        
        if (token) {
            this.props.resetPassword(token, password, passwordConfirm).then(() => {
                this.props.history.push('/signin');
            })
            .catch(() => {
                return;
            });
        } else {
            this.props.requestPasswordReset(this.state.email).then(() => {
                return;
            })
            .catch(() => {
                return;
            });
        } 
    };

    render() {
        const {email} = this.state;
        const {errors, history, removeError, notifications, removeNotification} = this.props;
        const token = new URL(document.location).searchParams.get('token');

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
            removeNotification();
        });

        return (
            <div>
                <div className="row justify-content-md-center text-center">
                    <div className="col-md-6">
                        <form onSubmit={this.handleSubmit}>
                            <h2>Reset Your Password</h2>
                            {errors.message && (
                                <div className="alert alert-danger">{errors.message.map((err, i) => {
                                    return (<p key={i}>{err}</p>);
                                })}</div>
                            )}
                            {notifications.notification && (
                                <div className="alert alert-success">{notifications.notification.map((notification, i) => {
                                    return (<p key={i}>{notification}</p>);
                                })}</div>
                            )}
                            {token ? pwdInput : emailInput}
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
