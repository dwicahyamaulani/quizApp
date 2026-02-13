import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = () => {
    const { name, email, password } = form;

    if (!name.trim()) {
      alert("Nama wajib diisi");
      return;
    }

    if (!email.includes("@")) {
      alert("Email tidak valid");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-card">
    <h2>Quiz App</h2>
    <p>Silakan login untuk mulai quiz</p>

    <div className="form-group">
        <label>Masukkan Nama</label>
        <input
        type="text"
        name="name"
        placeholder="Nama"
        value={form.name}
        onChange={handleChange}
        />
    </div>

    <div className="form-group">
        <label>Masukkan Email</label>
        <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        />
    </div>

    <div className="form-group">
        <label>Masukkan Password Minimal 6 Karakter</label>
        <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        />
    </div>

    <button onClick={handleLogin}>
        Login
    </button>
    </div>

  );
}
