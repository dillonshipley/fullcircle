import './App.css';

import React from 'react';

import InitialForm    from './initialForm/InitialForm';
import AdminDashboard      from './admin/AdminDashboard'

import {useState} from 'react';


function App() {
  return (
    <div className="App">
      <AdminDashboard />
      <InitialForm />
    </div>

    
  );
}

export default App;
