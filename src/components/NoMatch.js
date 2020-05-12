import React from 'react';
import {Link} from 'react-router-dom';

const NoMatch = () => {
    return (
        <div className="justify-content-md-center text-center">
            <h1>Nothing to See Here!</h1>
            <p><Link to="/">Click Here To Return to the Homepage</Link></p>
        </div>         
    );
};

export default NoMatch;
