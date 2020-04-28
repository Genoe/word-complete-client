import React, {Component} from 'react';
import {connect} from 'react-redux';
import {requestPasswordReset} from '../store/actions/auth';

class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            message: ''
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
            this.setState({
                message: msg
            });
        })
        .catch(() => {
            return;
        });
    };

    render() {
        const {email, message} = this.state;
        const {errors, history, removeError} = this.props;

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
                                <div className="alert alert-danger">{errors.message.join(', ')}</div>
                            )}
                            {message && (
                                <div className="alert alert-success">{message}</div>
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
        errors: state.errors
    };
}

export default connect(mapStateToProps, {requestPasswordReset})(ResetPasswordForm);
