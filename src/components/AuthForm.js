import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const recaptchaRef = React.createRef();

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
            recaptchaRef.current.reset();
            this.setState({ captchaToken: '' });
            return;
        });
    };

    render() {
        const {email, username, captchaToken} = this.state;
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
                                    <label htmlFor="password">Confirm Password:</label>
                                    <input 
                                        className="form-control" 
                                        id="passwordConfirm"
                                        name="passwordConfirm" 
                                        onChange={this.handleChange} 
                                        type="password"
                                    />
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
                                className="recaptcha"
                                sitekey={process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}
                                onChange={(e) => this.setState({ captchaToken: e })}
                                ref={recaptchaRef}
                            />
                            <p>Forgot Password? <Link to="/resetpassword">Click Here</Link></p>
                            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={ !captchaToken }>
                                {buttonText}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
