import {BrowserRouter, Routes, Route} from "react-router-dom";
import Welcoming from "./pages/Welcoming";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App(){
  return(
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcoming />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;