
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';


export default () => {

    const [email, setEmail] = useState('marta@gmail.com');
    const [password, setPassword] = useState('');
    const redirect = useNavigate();


    const logueja = (e) => {

        e.preventDefault();

        console.log("loguejant..", email, password)

        const credencials = {
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

        fetch(API_URL+'/login', opcions)
        .then(resp => resp.json())
        .then(data => {
            console.log("resp", data)
        
            if (!data.error) {
            redirect('/project')
            } else {redirect ("/error")}
            
        })
        .catch(err => console.log(err))
    }


    return (

        <div className="w-full max-w-xs w-82 mx-auto">
            <form onSubmit={logueja} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        onInput={(e) => setEmail(e.target.value)}
                        value={email}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Username" />
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
                    <button className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto" type="submit">
                        Iniciar sesión
                    </button>   
                </div>
            </form>
            
        </div>

    )
}


