import {Link, Outlet} from "react-router-dom";

function Error() {
    return(
    <>
        <h1 className="text-red-800 font-extrabold text-4xl">Hem detectat un error als teus credencials d'inici de sessió, torna-ho a intentar.</h1>
        <br/>
        <br />
        <Link to="/login" className="bg-slate-500 hover:bg-slate-700 text-white font-bold p-4 rounded  mx-auto m-10">Tornar al login</Link>
        
        
        
        
    </>
)}

export default Error;