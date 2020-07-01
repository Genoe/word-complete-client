import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export default class AuthForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: '',
            captchaToken: '',
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
        const authType = this.props.signUp ? 'signup' : 'signin';

        this.props.onAuth(authType, this.state).then(() => {
            this.props.history.push('/');
        })
        .catch(() => {
            return;
        });
    };

    captchaChg = e => {
        console.log('CAPTCHA VAL', e);
        this.setState({
            captchaToken: e
        });
    }

    render() {
        const {email, username} = this.state;
        const {heading, buttonText, signUp, errors, history, removeError} = this.props;

        history.listen(() => {
            removeError();
        });

        return (
            <div>
                <div className="row justify-content-md-center text-center">
                    <div className="col-md-6">
                        <form onSubmit={this.handleSubmit}>
                            <h2>{heading}</h2>
                            {errors.message && (
                                <div className="alert alert-danger">{errors.message.map((err, i) => {
                                    return (<p key={i}>{err}</p>);
                                })}</div>
                            )}
                            <label htmlFor="email">Email:</label>
                            <input 
                                className="form-control" 
                                id="email"
                                name="email" 
                                onChange={this.handleChange} 
                                value={email} 
                                type="text"
                            />
                            <label htmlFor="password">Password:</label>
                            <input 
                                className="form-control" 
                                id="password"
                                name="password" 
                                onChange={this.handleChange} 
                                type="password"
                            />
                            {signUp && (
                                <div>
                                    <label htmlFor="username">Username:</label>
                                    <input 
                                        className="form-control" 
                                        id="username"
                                        name="username" 
                                        onChange={this.handleChange} 
                                        value={username} 
                                        type="text"
                                    />
                                </div>
                            )}
                            <ReCAPTCHA
                                sitekey="6LeIPasZAAAAAGmDIpz9lyxjQVV7S0Lq4NqMayVS"
                                onChange={this.captchaChg}
                            />
                            <p>Forgot Password? <Link to="/resetpassword">Click Here</Link></p>
                        <button type="submit" className="btn btn-primary btn-block btn-lg">
                            {buttonText}
                        </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
