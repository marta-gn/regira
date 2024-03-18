import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';


function NouProjecte() {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [active, setActive] = useState(true);
    const redirect = useNavigate();


    const creaProjecte = (e) => {

        e.preventDefault();

        console.log("creant projecte..", name, description, active)

        const credencials = {
            name,
            description,
            active
        }

        const opcions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(credencials)
        }

        fetch(API_URL+'/project', opcions)
        .then(resp => resp.json())
        .then(data => {
            console.log("resp", data);
            redirect('/')
            
        })
        .catch(err => console.log(err))

    }

    
    return (
    <>
        <div className="w-full max-w-xs w-82 mx-auto">
            <form onSubmit={creaProjecte} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nom
                    </label>
                    <input
                        onInput={(e) => setName(e.target.value)}
                        value={name}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Descripció
                    </label>
                    <input
                        onInput={(e) => setDescription(e.target.value)}
                        value={description} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Crear projecte
                    </button>
                </div>
            </form>
            
        </div>

        
    </>
        
  )}

  export default NouProjecte;
