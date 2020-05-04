import React, {Component} from 'react';
import {Link} from 'react-router-dom'

export default class AccountForm extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            newUsername: ''
        };
    }

    handleNewUsername = event => {
        event.preventDefault();
        this.props.putNewUsername(this.state.newUsername).then(() => {            
            this.props.history.push('/');
        })
        .catch(() => {
            return;
        });
    }

    // making a inline function for onChange instead of a generic handleChange function since we only have one input (for the sake of conciseness)
    render() {
        return (
            <div className="row justify-content-md-center text-center">
                <div className="col-md-6">
                    <form onSubmit={this.handleNewUsername}>
                        {this.props.errors.message && (
                            <div className="alert alert-danger">{this.props.errors.message.map((err, i) => {
                                return (<p key={i}>{err}</p>);
                            })}</div>
                        )}
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            name="username" 
                            type="text"
                            className="form-control"
                            value={this.state.newUsername}
                            onChange={e => this.setState({newUsername: e.target.value})}
                        />
                        <br />
                        <button type="submit" className="btn btn-primary btn-block btn-lg">
                            Update My Username!
                        </button>
                        <br />
                        <p>Want to reset your password? <Link to="/resetpassword">Click Here</Link></p>
                    </form>
                </div>
            </div>
        );
    }
}
