import React, { useState } from "react";
import axios from "axios";
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

    console.log("선택된 장르:", selectedGenre);
    console.log("선택된 개봉 유형:", selectedReleaseType);
    console.log("선택된 국가:", selectedCountry);

    setLoading(true);
    setError(null);

    try {
      const requestPayload = {
        movieGenre: selectedGenre || "",
        releaseType: selectedReleaseType || "",
        language: selectedCountry || "",
      };

      console.log("서버에 보낼 요청 데이터:", requestPayload);

      const response = await axios.post(
        "http://13.125.98.63:8080/api/movies/recommend",
        requestPayload
      );

      // 응답 상태와 데이터 로그 출력
      console.log("서버 응답 상태:", response.status);
      console.log("서버 응답 데이터:", response.data);

      if (response.status !== 200) {
        throw new Error("Network response was not ok.");
      }
      setMovies(response.data || []); // 응답 데이터가 직접 영화 목록일 경우
      // API에서 받은 데이터를 movies에 저장
    } catch (error) {
      console.error("영화 데이터를 가져오는 데 실패했습니다:", error);
      setError("영화 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainpage">
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
                  {movie.movieName} - {movie.genre} ({movie.country})
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
