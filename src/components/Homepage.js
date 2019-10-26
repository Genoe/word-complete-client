import React from 'react';
import {Link} from 'react-router-dom';

const Homepage = () => {
    return (
        <div className="home-hero">
            <h1>What's Happening?</h1>
            <h4>New to Word Complete?</h4>
            <Link to="/signup" className="btn btn-primary">
                Sign Up Here
            </Link>
            {/* Credits For Unsplash image */}
            <div className="unsplash-container">
                <a className="unsplash-credits"               
                    href="https://unsplash.com/@brett_jordan?utm_medium=referral&utm_campaign=photographer-credit&utm_content=creditBadge"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download free do whatever you want high-resolution photos from Brett Jordan"
                    >
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                            <title>unsplash-logo</title>
                            <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
                        </svg>
                    </span>
                    <span>
                        Brett Jordan
                    </span>
                </a>;
            </div>
        </div>
    );
}

export default Homepage;