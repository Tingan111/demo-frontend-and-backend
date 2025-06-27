import {useEffect, useState} from "react";

function App(){
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [message,setMessage]=useState("");
    useEffect(()=>{
        fetch("http://localhost:4000/api/todos/read")
          .then((res) => res.json())
          .then(setTodos);
    }, []);
    const handleSubmit = async () => {
      if(!text.trim())return setMessage("請輸入內容") ;      
      const res=await fetch("http://localhost:4000/api/todos/create",{
        method:"POST",
        headers:{ 
          "Content-Type": "application/json" },
        body:JSON.stringify({text:text.trim()}),
      });      
      const newTodo =await res.json();
      setTodos([newTodo,...todos]);
      setText("");
      setMessage("");
    };
    const handleDelete  = async(id)=>{
      if(!id){
        console.warn("id是undefined，刪除動作被終止");
        ;
        
      }
      const res = await fetch(`http://localhost:4000/api/todos/delete/${id}`,{
        method:"DELETE",
      });
      const result= await res.json();
      console.log(result);

      if(result.success){
        setTodos(todos.filter((todo)=>todo.id !==id));
      }
    };
    return(
      <div>
      <h1>Todo list</h1>
      <div>{message}</div>
        <input 
        className="border-2 border-gray-400" 
        value={text} 
        onChange={(e) => setText(e.target.value)} />
        <button  
        className="ml-4 bg-sky-500 rounded-sm outline-2 outline-block-600/100"
        onClick={handleSubmit}>
          新增</button>
      <ul>
        {todos.map((todo)=>(
         <li
         className="mt-2"
          key={todo.id}>{todo.text}
          <button 
           className="ml-4 bg-red-400 rounded-sm outline-2 outline-block-600/100"
          onClick={()=>handleDelete(todo.id)}>刪除</button></li>
          
      ))}
      </ul>
      </div>

    )
}

export default App;