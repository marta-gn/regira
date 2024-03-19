
import { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import IssueCard from "./IssueCard.jsx";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const ItemType = 'TASK_ITEM';

const BOXES = [
  { state: 'backlog', name: 'Backlog' },
  { state: 'in_progress', name: 'In progress' },
  { state: 'review', name: 'Review' },
  { state: 'done', name: "Done" },
  { state: 'closed', name: 'Closed' }
];

const Item = ({ deleteItem, data }) => {
  const [{ isDragging }, drag_ref] = useDrag({
      type: ItemType,
      item: { type: ItemType, id: data.id }
  });
  return <IssueCard reference={drag_ref} isDragging={isDragging} data={data} remove={deleteItem} />;
};

const Box = ({ children, box, moveItem }) => {
  const [{ isOver }, drop_ref] = useDrop({
      accept: ItemType,
      drop: (item) => {
          moveItem(item, box.state)
      },
      collect: (monitor) => ({
          isOver: !!monitor.isOver(),
      }),
  });

  return (
    <div ref={drop_ref} className={`bg-slate-100 p-3 min-h-[400px] border ${isOver ? 'border-blue-500' : ''}`}>
        <h2 className="text-xl text-center mb-4" >{box.name}</h2>
        {children}
    </div>
);

}

// COMPONENTE KANBAN

function DetallProject() {

    const { projectId } = useParams();
    
    const API_URL = "http://localhost:3000/api";

    const [kanban, setKanban] = useState({tasks: []});
    const [project, setProject] = useState([]);
    const [error, setError] = useState('');
    const redirect = useNavigate();
    const [update, setUpdate] = useState(0);

    const moveItem = (item, state) => {
      const options = {
          credentials: 'include',
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ state })
      }

      fetch(API_URL + '/task/' + item.id, options)
          .then(r => r.json())
          .then(data => {
              if (data.error == 'Unauthorized') logout();
              else setUpdate(update + 1);
          })
          .catch(err => console.log(err))
  }

  const deleteItem = (item) => {
    const options = {
        credentials: 'include',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(API_URL + '/task/' + item.id, options)
        .then(r => r.json())
        .then(data => {
            if (data.error == 'Unauthorized') logout();
            else setUpdate(update + 1);
        })
        .catch(err => console.log(err))
    }
  
  useEffect(() => { console.log(project) }, [project]);
  
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
  }, [update]);





    return (
    <>
  
  <div className="flex justify-between">

<h1 className="font-bold text-3xl">Projecte: <span className="bg-yellow-200 p-2 rounded-lg">{kanban.name}</span></h1>
<button className="rounded-lg p-3 bg-red-200" onClick={() => redirect(`/task/new/${projectId}`)}>Nova tasca</button>
</div>

<br />
<br />

<DndProvider backend={HTML5Backend}>
<div className="grid grid-cols-5 gap-3">
    {
      BOXES.map(box => (
        <Box key={box.state} box={box} moveItem={moveItem}>
            {kanban.tasks.filter(e => e.state == box.state).map(e => <Item key={e.id} deleteItem={deleteItem} data={e} />)}
        </Box>
    ))}
    
</div>
</DndProvider>




    {/*
    <h1 className="font-extrabold text-4xl">Llista de tasques</h1>
    <br />
    <Link className="bg-slate-500 rounded-lg p-3 mt-20" to={"/task/new/" + projectId} >Nova tasca</Link>

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
    */}
    
    
    </>
)}

export default DetallProject;