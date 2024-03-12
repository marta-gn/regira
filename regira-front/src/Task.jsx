import { useState , useEffect} from 'react'
import {Link, Outlet} from "react-router-dom";

import './App.css'

function LlistaTask() {

const [task, setTask] = useState([]);


const API_URL = 'http://localhost:3000/api';

useEffect (() => {
  fetch(API_URL + "/task")
  .then(resp => resp.json())
  .then(data => {
    if (data.error){
      setError(true)
    } else {
      setTask(data);
    }
  })
}, [])



  return (
    <>
    <Link className="bg-slate-900 hover:bg-slate-700 text-white rounded p-2 mb-1" to="/project">Tornar</Link>
    {
  
    task.map((task, index) => (
      <div key={index} className="bg-slate-100 m-4 p-5 rounded-lg">
      <h1 className="text-3xl font-extrabold"> {task.name}</h1>
      <h1> {task.description}</h1>
      <br/>
      
      <h1><span className="font-bold">Prioritat:</span> {task.priority}</h1>
      <h1><span className="font-bold">Estat:</span> {task.state}</h1>
      <h1><span className="font-bold">Tipus de tasca:</span> {task.task_type}</h1>
      </div>

    ))
    }

    

  
    </>
)}
export default LlistaTask;

