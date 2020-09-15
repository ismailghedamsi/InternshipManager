import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';

import Navbar from './Components/Header/Navbar';
import Footer from './Components/Footer/Footer';

function App() {
  return (
    <div className="App">

      <div className="page-container">
        <div className="page-nav">
          <Navbar />
      <header className="App-header">
        <Register />
        <Login />
      </header>
        </div>
        <Footer />
      </div>

    </div>
  );
}

export default App;
