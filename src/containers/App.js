import React from 'react';
import Navbar from './Navbar';
import Main from './Main';
import {BrowserRouter as Router} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="onboarding">
        <Navbar />
        <Main />
      </div>
    </Router>
    
  );
}

export default App;
