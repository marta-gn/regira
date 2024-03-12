import { useState , useEffect} from 'react'
import './App.css'

function LlistaUsers() {

const [user, setUser] = useState([]);


const API_URL = 'http://localhost:3000/api';

useEffect (() => {
  fetch(API_URL + "/users")
  .then(resp => resp.json())
  .then(data => {
    if (data.error){
      setError(true)
    } else {
      setUser(data);
    }
  })
}, [])



  return (
    <>
    <h1 className="mb-5"><span className="font-extrabold text-5xl text-transparent bg-clip-text bg-gradient-to-r to-slate-800 from-slate-500">Usuaris</span></h1>
    {
    user.map((user, index) => (
      <div key={index} className="bg-indigo-200 mb-2 p-2">
      <h1 className="font-bold text-2xl">{user.name}</h1>
      <h1>{user.email}</h1>
      <h1>{user.password}</h1>
      </div>
    ))
    }

    

  
    </>
)}
export default LlistaUsers;

