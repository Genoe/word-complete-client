import React from 'react';
import {Link} from 'react-router-dom';
import Chatroom from '../containers/Chatroom';

const Homepage = ({ currentUser }) => {
    if (!currentUser.isAuthenticated) {
        return (
            <div>
                <div className="home-hero">
                    <h1>What's Happening?</h1>
                    <h4>New to Word Complete?</h4>
                    <Link to="/signup" className="btn btn-primary">
                        Sign Up Here
                    </Link>
                </div>

                <div className="github-links text-center">
                    <p>
                        Created by <a href="https://www.linkedin.com/in/wyattw/" target="_blank" rel='noreferrer noopener'>Wyatt Weisensel</a>
                        <br />
                        Github: <a href="https://github.com/Genoe/word-complete-client" target="_blank" rel='noreferrer noopener'>Frontend </a>
                        <a href="https://github.com/Genoe/word-complete-server" target="_blank" rel='noreferrer noopener'>Backend</a>
                    </p>
                </div>
            </div>         
        );
    }

    return (
        <div>
            <Chatroom />
        </div>
    )
}

export default Homepage;
