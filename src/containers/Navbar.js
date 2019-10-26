import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand">
                <div className='container-fluid'>
                    <Link to="/" className="navbar-brand">
                        Word Complete
                    </Link>
                    {/* {this.props.currentUser.isAuthenticated */ false ? (
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a onClick={this.logout}>Log out</a>
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

export default Navbar;