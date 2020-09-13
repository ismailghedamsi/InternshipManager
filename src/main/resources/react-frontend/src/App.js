import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Register/>
        <Login/>
      </header>
    </div>
  );
}

export default App;
