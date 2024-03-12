
import { useState } from "react";

import { useNavigate } from 'react-router-dom';


const API_URL = 'http://localhost:3000/api';


export default () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const redirect = useNavigate();


    const registra = (e) => {

        e.preventDefault();

        console.log("registrando..", name, email, password)

        const credencials = {
            name,
            email,
            password
        }

        const opcions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(credencials)
        }

        fetch(API_URL+'/register', opcions)
        .then(resp => resp.json())
        .then(data => {
            console.log("resp", data);
            redirect('/project')
            
        })
        .catch(err => console.log(err))

    }


    return (

        <div className="w-full max-w-xs w-82 mx-auto">
            <form onSubmit={registra} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Nom
                    </label>
                    <input
                        onInput={(e) => setName(e.target.value)}
                        value={name}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        onInput={(e) => setEmail(e.target.value)}
                        value={email}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        onInput={(e) => setPassword(e.target.value)}
                        value={password} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto" type="submit">
                        Registrarse
                    </button>
                </div>
            </form>
            
        </div>

    )
}


