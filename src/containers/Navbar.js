import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../store/actions/auth';

class Navbar extends Component {
    logout = e => {
        e.preventDefault();
        this.props.logout();
    }

    render() {
        return (
            <nav className="navbar navbar-expand">
                <div className='container-fluid'>
                    <Link to="/" className="navbar-brand">
                        Word Complete
                    </Link>
                    {this.props.currentUser.isAuthenticated ? (
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <Link to={`/users/${this.props.currentUser.user.id}/account`}>Manage Account</Link>
                            </li>
                            <li>
                                <a onClick={this.logout}  href="/">Log out</a>
                            </li>
                        </ul>
                    )
                    : (                  
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li>
                            <Link to="/signin">Log In</Link>
                        </li>
                    </ul>
                    )}
                </div>
            </nav>          
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    };
}

export default connect(mapStateToProps, {logout})(Navbar);