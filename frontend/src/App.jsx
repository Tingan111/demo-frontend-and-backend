import {useEffect, useState} from "react";
function App(){
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [message,setMessage]=useState("");
    useEffect(()=>{
        fetch("http://localhost:4000/api/todos")
          .then((res) => res.json())
          .then(setTodos);
    }, []);
    const handleSubmit = async () => {
      if(!text.trim())return setMessage("請輸入內容") ;      
      const res=await fetch("http://localhost:4000/api/todos",{
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
    return(
      <div>
      <h1>Todo list</h1>
      <div>{message}</div>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handleSubmit}>新增</button>
      <ul>
        {todos.map((todo)=>(
          <li key={todo.id}>{todo.text}</li>
      ))}
      </ul>
      </div>

    )
}

export default App;