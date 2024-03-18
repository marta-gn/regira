import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Context from "./Context";
import { useContext } from "react";

function NovaTasca() {

    const { projectId } = useParams();

    const {logout, API_URL} = useContext(Context);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [state, setState] = useState("");
    const [task_type, setTask_type] = useState("");
    const redirect = useNavigate();
    

    const creaTasca = (e) => {

        e.preventDefault();

        // console.log("creant tasca..", name, description, active)

        const credencials = {
            name,
            description,
            priority,
            state,
            task_type
        }

        const opcions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(credencials)
        }

        fetch(API_URL + '/task/project/' + projectId, opcions)
        .then(resp => resp.json())
        .then(data => {
            (data.error == "Unauthorized") ? logout() : redirect("/project/task/" + projectId);
        })
        .catch(err => console.log(err))
    }




    
    return (
    <>
        <div className="w-full max-w-xs w-82 mx-auto">
            <form onSubmit={creaTasca} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nom
                    </label>
                    <input
                        onInput={(e) => setName(e.target.value)}
                        value={name}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" id="name" type="text" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Descripció
                    </label>
                    <input
                        onInput={(e) => setDescription(e.target.value)}
                        value={description} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="description" id="description" type="text" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Prioridad
                    </label>
                    <input
                        onInput={(e) => setPriority(e.target.value)}
                        value={priority} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="priority" id="priority" type="text" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Estado
                    </label>
                    <input
                        onInput={(e) => setState(e.target.value)}
                        value={state} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="state" id="state" type="text" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Tipo de tasca
                    </label>
                    <input
                        onInput={(e) => setTask_type(e.target.value)}
                        value={task_type} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="task_type" id="task_type" type="text" />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Crear tasca
                    </button>
                </div>
            </form>
            
        </div>

        
    </>
        
)}

export default NovaTasca;
