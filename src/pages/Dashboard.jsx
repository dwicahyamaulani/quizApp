import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const categories = [
    { id: 9, name: "General Knowledge" },
    { id: 10, name: "Entertainment: Books" },
    { id: 12, name: "Entertainment: Music" },
  ];

  return (
    <div className="quiz-card center-content">
      <h2>Pilih Kategori</h2>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className="primary-btn"
          onClick={() =>
            navigate("/quiz", {
              state: { categoryId: cat.id },
            })
          }
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
