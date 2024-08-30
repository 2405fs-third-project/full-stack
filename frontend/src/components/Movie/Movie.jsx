import React, { useState } from "react";
import "./Movie.css";

const Movie = () => {
  const questions = [
    {
      id: 1,
      question: "어떤 장르를 좋아하시나요?",
      answers: [
        "드라마",
        "액션",
        "로맨스",
        "스릴러",
        "음악 영화",
        "블록 버스터",
        "영화 시리즈",
        "애니메이션",
      ],
    },
    {
      id: 2,
      question: "최근 개봉한 영화와 클래식 영화 중 어떤 것을 선호하시나요?",
      answers: ["최근 개봉 영화", "클래식 영화"],
    },
    {
      id: 3,
      question: "어떤 나라의 영화가 좋으신가요?",
      answers: ["미국", "한국", "일본", "중국", "그 외"],
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState(
    questions.map((question) => new Array(question.answers.length).fill(false))
  );
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckboxChange = (questionIndex, answerIndex) => {
    const updatedSelections = [...selectedAnswers];
    updatedSelections[questionIndex][answerIndex] =
      !updatedSelections[questionIndex][answerIndex];
    setSelectedAnswers(updatedSelections);
  };

  const handleSubmit = async () => {
    const selectedGenre = questions[0].answers.find(
      (_, index) => selectedAnswers[0][index]
    );
    const selectedReleaseType = questions[1].answers.find(
      (_, index) => selectedAnswers[1][index]
    );
    const selectedCountry = questions[2].answers.find(
      (_, index) => selectedAnswers[2][index]
    );

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genre: selectedGenre || "",
          releaseType: selectedReleaseType || "",
          country: selectedCountry || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      setMovies(data.movies || []);
    } catch (error) {
      setError("영화 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainpage">
      <div className="title">영화 추천 페이지</div>
      <div className="main">
        {questions.map((question) => (
          <div key={question.id} className="question-group">
            <div className="question">{question.question}</div>
            {question.answers.map((answer, answerIndex) => (
              <label key={`${question.id}-${answerIndex}`} className="answer">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={selectedAnswers[question.id - 1][answerIndex]}
                  onChange={() =>
                    handleCheckboxChange(question.id - 1, answerIndex)
                  }
                />
                {answer}
              </label>
            ))}
          </div>
        ))}
        <button className="submit-button" onClick={handleSubmit}>
          추천 영화 보러가기!
        </button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {movies.length > 0 && (
          <div>
            <h2>추천 영화 목록</h2>
            <ul>
              {movies.map((movie, index) => (
                <li key={index}>
                  {movie.movieName} - {movie.productionYear} (
                  {movie.releaseDate}) - {movie.country}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movie;
