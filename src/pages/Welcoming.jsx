import { useNavigate } from "react-router-dom";

export default function Welcoming() {
  const navigate = useNavigate();

  return (
    <div className="login-card">
      <h1>Welcome to MiniQuiz🧠</h1>
      <p>Test your knowledge!!!!</p>

      <button
        style={{ marginTop: "50px" }}
        onClick={() => navigate("/login")}
      >
        Get Started
      </button>
    </div>
  );
}
