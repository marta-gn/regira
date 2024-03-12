import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App.jsx'
import Inici from './Inici.jsx';
import Login from './Login.jsx';
import LlistaUsers from './Users';
import LlistaProject from './Project';
import LlistaTask from './Task'
import NouProjecte from './NouProjecte.jsx';
import Register from './Register.jsx';
import Error from './Error.jsx';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

          <Route index element={<Inici />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<LlistaUsers />} />
          <Route path="/project" element={<LlistaProject />} />
          <Route path="/project/new" element={<NouProjecte />} />
          <Route path="/task" element={<LlistaTask />} />
          <Route path="/error" element={<Error />} />


          
        </Route>
      </Routes>
    </BrowserRouter>

)