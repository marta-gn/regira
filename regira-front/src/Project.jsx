import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Context from "./Context";
import DetallProject from "./Kanban";



function LlistaProject() {
  const [projects, setProjects] = useState([]);
  const { login, handleLogout, setLogin } = useContext(Context);
  const [error, setError] = useState(false);

  const API_URL = "http://localhost:3000/api";

 /* useEffect(() => {
    if (!login) {
      redirect("/login");
    }
  }, [login]);

  useEffect(() => {
    if (document.cookie.includes("token")) {
      fetch(API_URL + "/refresh", { credentials: "include" })
        .then((e) => e.json())
        .then((data) => {
          if (data.error) {
            redirect("/login");
            handleLogout();
          } else {
            setLogin(data);
          }
        });
    }
  }, []);

  */

  useEffect(() => {
    fetch(API_URL + "/project")
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setProjects(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(true);
      });
  }, []);

  const redirect = (path) => {
    console.log("Redirecting to:", path);
  };


  function remove(projectId) {
    fetch(API_URL + `/project/${projectId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Project removed:", data);
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  }

  /* 
  
  function tasquesProjecte(projectId) {
    fetch(API_URL + `/task`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Tasques recuperades:", data);
        redirect(`/task`);
      })
      .catch((error) => {
        console.error("Error recuperant les tasques:", error);
      });
  }
  */


  return (
    <>
      <h1 className="font-extrabold text-4xl mb-3">Llista de projectes</h1>

      <Link
        className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded"
        to="/project/new"
      >
        Nou projecte
      </Link>

      <br />
      <br />

      <div className="flex flex-wrap -mx-4">
        {projects.map((project) => (
          <div key={project.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="font-bold mb-2 text-2xl">{project.name}</div>
                <div className="text-neutral-500 mb-2">{project.description}</div>

                <button
                  className="border p-2 mr-2 bg-red-800 hover:bg-red-600 rounded-lg text-white font-bold"
                  onClick={() => remove(project.id)}
                >
                  Elimina
                </button>

                <Link className="border p-2 mr-2 bg-emerald-800 hover:bg-emerald-600 rounded-lg text-white font-bold" to={`/project/task/${project.id}`}>Detalle</Link>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default LlistaProject;
