import './App.css';

import React from 'react';

import InitialForm    from './initialForm/InitialForm';
import Dashboard      from './admin/Dashboard'

import {useState} from 'react';


function App() {
  return (
    <div className="App">
      <Dashboard />
      <InitialForm />
    </div>

    
  );
}

export default App;
