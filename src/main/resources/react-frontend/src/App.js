import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';

import Navbar from './Components/Header/Navbar';
import Footer from './Components/Footer/Footer';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div className="page-container">
        <div className="page-nav">
          <Router>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Register}></Route>
              <Route path="/register" component={Register}></Route>
              <Route path="/login" component={Login}></Route>
            </Switch>
          </Router>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
