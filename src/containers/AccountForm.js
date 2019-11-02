import React, {Component} from 'react';
import {connect} from 'react-redux';
import {putNewUsername} from '../store/actions/auth';

class AccountForm extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            newUsername: ''
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    handleNewUsername = event => {
        event.preventDefault();
        this.props.putNewUsername(this.state.newUsername).then(() => {
            if (this._isMounted) {
                this.setState({newUsername: ''});
            }
            
            this.props.history.push('/');
        })
        .catch((e) => {
            console.log(e);
            return;
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // making a inline function for onChange instead of a generic handleChange function since we only have one input (for the sake of conciseness)
    render() {
        return (
            <form onSubmit={this.handleNewUsername}>
                {this.props.errors.message && (
                    <div className="alert alert-danger">{this.props.errors.message.join(', ')}</div>
                )}
                <input
                    type="text"
                    className="form-control"
                    value={this.state.newUsername}
                    onChange={e => this.setState({newUsername: e.target.value})}
                />
                <button type="submit" className="btn btn-success pull right">
                    Update My Username!
                </button>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errors
    };
}

export default connect(mapStateToProps, {putNewUsername})(AccountForm);