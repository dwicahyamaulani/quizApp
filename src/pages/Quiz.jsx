import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Quiz.css";

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const categoryId = location.state?.categoryId;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // resume - load data
  useEffect(() => {
    const savedQuiz = localStorage.getItem("quizData");

    if (savedQuiz) {
      const parsed = JSON.parse(savedQuiz);

      if (parsed.categoryId === categoryId ) {
        setQuestions(parsed.questions);
        setCurrent(parsed.current);
        setAnswers(parsed.answers);
        setTimeLeft(parsed.timeLeft);
        setHasStarted(true);
      } else {
        localStorage.removeItem("quizData");
      }
    }
  }, [categoryId]);

  // cek kategori
  if (!categoryId) {
    return (
      <div className="quiz-card center-content">
        <h2>Kategori tidak ditemukan</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/dashboard")}
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  // fetch soal dari API
  const fetchQuestions = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple`
      );

      const data = await res.json();

      if (data.response_code === 0) {
        setQuestions(data.results);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.log("Fetch error:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // jika error fetch API 
  if (hasStarted && !loading && questions.length === 0) {
    return (
      <div className="quiz-card center-content">
        <h2>Soal tidak tersedia</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/dashboard")}
        >
          Kembali
        </button>
      </div>
    );
  }

  // auto save saat state berubah
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (questions.length > 0 && hasStarted) {
      const quizData = {
        categoryId,
        questions,
        current,
        answers,
        timeLeft,
      };

      localStorage.setItem("quizData", JSON.stringify(quizData));
    }
  }, [questions, current, answers, timeLeft, hasStarted, categoryId]);

  // timer
  useEffect(() => {
    if (!hasStarted) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasStarted]);

  // shuffle opsi
  useEffect(() => {
    if (!questions.length) return;

    const currentQuestion = questions[current];
    if (!currentQuestion) return;

    const options = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer,
    ];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    setShuffledOptions(options);
  }, [current, questions]);

  // sebelum mulai kuis
  if (!hasStarted) {
    return (
      <div className="quiz-card center-content">
        <h2>Siap Mulai Quiz?</h2>
        <button
          className="primary-btn"
          onClick={() => {
            setHasStarted(true);
            fetchQuestions();
          }}
        >
          Mulai Quiz
        </button>
      </div>
    );
  }

  // loading
  if (loading) {
    return (
      <div className="quiz-card center-content">
        <h2>Loading soal...</h2>
      </div>
    );
  }

  const isFinished =
    hasStarted &&
    (timeLeft <= 0 || current >= questions.length);

  // result test
  if (isFinished) {
    const correct = answers.filter(Boolean).length;
    const wrong = answers.length - correct;
    const score = correct * 20;

    localStorage.removeItem("quizData");

    return (
      <div className="quiz-card result-card">
        <h2>Hasil Kuis</h2>

        <div className="score-circle">
          {score}
        </div>

        <p>Total Soal: {questions.length}</p>
        <p>Benar: {correct}</p>
        <p>Salah: {wrong}</p>

        <div className="result-buttons">
          <button onClick={() => navigate("/dashboard")}>
            Main Lagi
          </button>

          <button
            className="logout-btn"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[current];
  if (!currentQuestion) return null;

  const handleAnswer = (option) => {
    const isCorrect =
      option === currentQuestion.correct_answer;

    setAnswers((prev) => [...prev, isCorrect]);
    setCurrent((prev) => prev + 1);
  };

  // quiz page - total soal, waktu, 1 halaman 1 soal, pilih opsi = pindah soal
  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <div className="timer">⏳ {timeLeft} detik</div>
        <div>
          Soal {current + 1} / {questions.length}
        </div>
      </div>

      <h3
        className="question"
        dangerouslySetInnerHTML={{
          __html: currentQuestion.question,
        }}
      />

      <div className="options">
        {shuffledOptions.map((opt, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleAnswer(opt)}
            dangerouslySetInnerHTML={{ __html: opt }}
          />
        ))}
      </div>
    </div>
  );
}
