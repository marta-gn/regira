const State = ({value}) => <h2>{value}</h2> 
const Priority = ({value}) => <h2>{value}</h2> 
const Type = ({value}) => <h2>{value}</h2> 

const getColorByType  = ({priority}) => {
    
    if (priority==='high'){
        return 'bg-red-200';
    } else if (priority==='low'){
        return 'bg-green-200';
    } else { // mid
        return 'bg-orange-200'
    }
}


export default ({data, reference, isDragging, remove}) =>  {

    return (
        <>
            <div ref = {reference}  className={"border p-3 m-3 rounded-lg "+getColorByType(data)}>
                <h1 className="font-bold">{data.name}</h1>
                <p>{data.description}</p>
                <br /><br />
                <h2 className="bg-slate-500 text-white rounded-lg mb-2 p-2 w-1/2">{data.state}</h2>
                <h2 className="bg-slate-500 text-white rounded-lg mb-2 p-2 w-1/2">{data.task_type}</h2>
                <h2 className="bg-slate-500 text-white rounded-lg mb-2 p-2 w-1/2">{data.priority}</h2>


                {/*<Type value={data.type} />
                <Priority value={data.priority} />
                <State value={data.state} />*/}
                <button className="p-2 bg-red-600 hover:bg-red-400 mt-2 rounded-lg text-white" onClick={()=>remove(data)}>Elimina</button>
            </div>
        </>
    )
}