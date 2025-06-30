import {useEffect, useState} from "react";

function App(){
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [message,setMessage]=useState("");
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState("");

    //讀取功能開始
    useEffect(()=>{
        fetch("http://localhost:4000/api/todos/read")
          .then((res) => res.json())
          .then(setTodos);
    }, []);
    //讀取功能結束
    
    //新增功能開始
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
    //新增功能開始

    //刪除功能結束
    const handleDelete  = async(id)=>{
      if(!id){
        console.warn("id是undefined，刪除動作被終止");
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

    //編輯功能開始
    const handleEdit = (todo) => {
      setEditId(todo.id);
      setEditText(todo.text);
    };
    //編輯功能結束

    //更新功能開始
    const handleUpdate=async (id)=>{
      if(!editText.trim()) return setMessage("請輸入編輯內容");

      const res = await fetch(`http://localhost:4000/api/todos/edit/${id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({text:editText.trim()}),
    });
    if (!res.ok) {
  const text = await res.text();
  console.error("錯誤 HTML 回傳內容：", text);
  setMessage("更新失敗：後端無此路由");
  return;
}
    const result = await res.json();

    if(result.success){
      setTodos(
        todos.map((todo)=>
          todo.id===id?{...todo, text:editText.trim()}:todo
      )
    );
    setEditId(null);
    setEditText("");
    setMessage("");
  }}
    //編輯功能結束
    return(
      <div>
      <h1>Todo list</h1>
      <div>{message}</div>
        
        <input 
        className="border-2 border-gray-400" 
        value={text} 
        onChange={(e) => setText(e.target.value)} />
        <button  
        className="ml-4 bg-sky-300 text-white rounded-sm border-2 border-gray-500 hover:bg-sky-400"
        onClick={handleSubmit}>
          新增</button>
          <ul>
  {todos.map((todo) => (
    <li className="mt-2" key={todo.id}>
      {editId === todo.id ? (
        <>
          <input
            className="border px-1"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button
            className="ml-4 bg-green-300 rounded-sm  text-white rounded-sm border-2 border-gray-500 hover:bg-green-300"
            onClick={() => handleUpdate(todo.id)}
          >
            更新
          </button>
          <button
            className="ml-4 bg-gray-300 rounded-sm  text-white rounded-sm border-2 border-gray-500 hover:bg-gray-400"
            onClick={() => {
              setEditId(null);
              setEditText("");
            }}
          >
            取消
          </button>
        </>
      ) : (
        <>
          {todo.text}
          <button
            className="ml-4 bg-sky-300 rounded-sm  text-white rounded-sm border-2 border-gray-500 hover:bg-sky-400"
            onClick={() => handleEdit(todo)}
          >
            編輯
          </button>
          <button
            className="ml-4 bg-red-300 rounded-sm  text-white rounded-sm border-2 border-gray-500 hover:bg-red-400"
            onClick={() => handleDelete(todo.id)}
          >
            刪除
          </button>
        </>
      )}
    </li>
  ))}
</ul>
      </div>
    )
  }


export default App;