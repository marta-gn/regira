
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Context from "./Context";
import IssueCard from './IssueCard';

const ItemType = 'ISSUE_ITEM';  

const CAIXES = [
  {state: 'backlog', titol: 'Pendent'},
  {state: 'in_progress', titol: 'En curs'},
  {state: 'review', titol: 'Revisió'},
  {state: 'testing', titol: 'Testejant'},
  {state: 'done', titol: 'Fet'},
  {state: 'closed', titol: 'Tancat'}
];

const Item = ({ eliminaItem, data}) => {
  const [{ isDragging }, drag_ref] = useDrag({
    type: ItemType,
    item: { type: ItemType, id: data.id }
  });

  return <IssueCard reference={drag_ref}
  isDragging={isDragging} data={data} remove={eliminaItem} />;

};

  const Box = ({ children, caixa, mouItem }) => {
    const [{ isOver }, drop_ref] = useDrop ({
      accept: ItemType,
      drop: (item) => {
        mouItem(item, caixa.state)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
        <div ref={drop_ref} className={`bg-slate-100 p-3 min-h-[400px] border ${isOver ? 'border-blue-500' : ''}`}>
            <h2 className="text-xl text-center mb-4" >{caixa.titol}</h2>
            {children}
        </div>
      );
  };



// COMPONENTE KANBAN

function DetallProject() {

    const { projectId } = useParams();
    
    const API_URL = "http://localhost:3000/api";

    const [error, setError] = useState(false);
    const [kanban, setKanban] = useState({tasks: []});


  
    useEffect(() => {
        fetch(API_URL + `/task/project/${projectId}`, {credentials: 'include'})
          .then((resp) => resp.json())
          .then((data) => {
            if (data.error) {
              setError(true);
            } else {
              setKanban(data);
              console.log(data);
            }
          })
          .catch(() => {
            console.error("Error fetching data:", error);
            setError(true);
          });
      }, []);





    return (
    <>

    <Link to={"/task/new/" + projectId} >Nova tasca</Link>

    <div>
    {kanban.tasks.map((tarea) => (
        <div key={tarea.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="font-bold mb-2 text-2xl">{tarea.name}</div>
            <div className="mb-4">{tarea.description}</div>
            <div className="bg-blue-100 rounded-lg p-3 w-52 mb-2 text-sm">{tarea.priority}</div>
            <div className="bg-blue-100 rounded-lg p-3 w-52 mb-2 text-sm">{tarea.state}</div>
            <div className="bg-blue-100 rounded-lg p-3 w-52 mb-2 text-sm">{tarea.task_type}</div>
        </div>
        </div>
        </div>

        
        
        
    
    ))}
    </div>
    
    
    </>
)}

export default DetallProject;