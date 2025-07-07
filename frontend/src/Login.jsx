import{useState} from "react";
import{useNavigate} from "react-router-dom";

const Login=() =>{
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[errorMsg,setErrorMsg]=useState("");

    const navigate=useNavigate();

    const handlelogin=async(e) =>{
        e.preventDefault();
        setErrorMsg("");

        try{
            const res=await fetch("http://localhost:4000/api/login", {
                method:"POST",
                headers:{"Contnet-Type":"application/json"},
                body:JSON.stringify({email,password}),
            });
            const data = await res.json();

            if(!res.ok){
                setErrorMsg(data.error||"登入失敗，請檢查您的電子郵件和密碼");
                return;
            }

            localStorage.setItem("token", data.token);
            navigate("/dashboard") // 登入成功導向個人頁
        }catch(err){
            console.error(err);
            setErrorMsg("連線錯誤，請稍後再試");
        }
};

return(
    <form onSubmit={handlelogin}>
        <input type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="請輸入 email"
                />
        <input type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="請輸入密碼" 
                />
                <button type="submit">登入</button>
                {errorMsg && <p style={{color:"red"}}>{errorMsg}</p>}
    </form>
);
};

export default Login;