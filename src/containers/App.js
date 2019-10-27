import React from 'react';
import Navbar from './Navbar';
import Main from './Main';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '../store';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="onboarding">
          <Navbar />
          <Main />
        </div>
      </Router>
    </Provider>
    
    
  );
}

export default App;
