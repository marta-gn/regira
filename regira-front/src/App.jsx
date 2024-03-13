import './App.css'
import {Link, Outlet, useNavigate} from "react-router-dom";
import Context from './Context';
import { useState, useEffect } from 'react';
const API_URL = "http://localhost:3000/api";


function App() {

  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const redirect = useNavigate();

  useEffect(() => {
    if (!login){
      redirect('/login')
    }

  },[login])

  const data = {login, setLogin, register, setRegister}

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login"; 
    setLogin(false);
  };

  useEffect(() => {
    if (document.cookie.includes('token')) {
      fetch(API_URL + '/refresh', { credentials: "include" })
        .then(e => e.json())
        .then(data => {
          if (data.error) {
            redirect('/login');
            handleLogout();
          } else {
            setLogin(data)
          }
        })
    }
  }, []);

  
  /*const handleRegister = () => {
    // Clear the authentication token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Set the expiration date to a past date
    // Redirect the user to the login page or any other appropriate page
    window.location.href = "/register"; // Redirect to the login page
  };*/


  const tornar = () => {
    window.location.href = "/";
  }

  return (
    <>
  <Context.Provider value={data}>

    <div className="flex justify-between bg-teal-700">
    
    <button onClick={tornar} className="flex flex-cols-2 text-slate-600 text-3xl font-extrabold text-white p-3">
      <img src="/img/regira.png" className="w-20 h-max mr-2" alt="Regira Logo" />Regira</button>

    <div className="p-2 m-5">
    {login && <button className="border solid px-4 py-2 bg-red-800 hover:bg-red-600 text-white rounded mr-3" onClick={handleLogout}>Logout ({login.name})</button>}
    {!register && !login && <Link className="px-4 p-3 bg-orange-700 hover:bg-orange-600 text-white rounded" to="/register">Registre</Link>}

    </div>
    </div>

    

      <div className="p-10">
        <Outlet />
      </div>

  </Context.Provider>
    </>
)}
export default App;

/* <Link className="border px-4 py-2 bg-slate-800 text-white rounded" to="/users">Usuaris</Link>
  <Link className="border px-4 py-2 bg-slate-800 text-white rounded" to="/task" >Tasques</Link>
        <Link className="border px-4 py-2 bg-slate-800 text-white rounded" to="/login" >Login</Link>

*/