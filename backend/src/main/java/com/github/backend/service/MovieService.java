package com.github.backend.service;

import com.github.backend.dto.AddMovieRequest;
import com.github.backend.dto.MovieRecommendationRequest;
import com.github.backend.dto.MovieResponse;
import com.github.backend.model.Movie;
import com.github.backend.model.QMovie;
import com.github.backend.repository.MovieRepository;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final JPAQueryFactory jpaQueryFactory;
    private final RuntimeRangeService runtimeRangeService;

    @Value("${image.upload.path}")
    private String imagePath;

    @Value("${image.save.path}")
    private String imageSavePath;

    @Transactional(readOnly = true)
    public MovieResponse getMovieById(Integer id) {
        final String MOVIE_NOT_FOUND_MESSAGE = "Movie not found";
        final String MOVIE_STATE_ERROR_MESSAGE = "Movie is not currently showing";
        final String PATH_SEPARATOR = "/";

        // 영화 정보 조회
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(MOVIE_NOT_FOUND_MESSAGE));

        // 영화 상태 확인
        if (movie.getMovieState() != MovieState.상영중) {
            throw new IllegalArgumentException(MOVIE_STATE_ERROR_MESSAGE);
        }

        // 이미지 경로 생성
        String cleanedImagePath = imagePath.endsWith(PATH_SEPARATOR)
                ? imagePath.substring(0, imagePath.length() - 1)
                : imagePath;
        String moviePosterPath = movie.getMoviePoster().startsWith(PATH_SEPARATOR)
                ? movie.getMoviePoster().substring(1)
                : movie.getMoviePoster();
        String fullImagePath = cleanedImagePath + PATH_SEPARATOR + moviePosterPath;

        // MovieResponse 생성 및 반환
        return new MovieResponse(
                movie.getId(),
                movie.getMovieName(),
                movie.getMovieGenre(),
                fullImagePath,
                movie.getMovieDirector(),
                movie.getRecommend(),
                movie.getMovieActor(),
                movie.getMovieGrade(),
                movie.getMovieRanking(),
                movie.getAttendance(),
                movie.getComGrade(),
                movie.getMovieTime(),
                movie.getRelease(),
                movie.getMovieState().getDisplayName(),
                movie.getLanguage()
        );
    }

//    @Transactional
//    public MovieResponse createMovie(AddMovieRequest addMovieRequest) {
//        // 이미지 저장 및 경로 생성
//        String posterPath = saveImage(addMovieRequest.getMoviePoster());
//
//        // MovieState 변환
//        MovieState movieState = MovieState.fromDisplayName(addMovieRequest.getMovieState());
//
//        // Movie 객체 생성 및 필드 설정
//        Movie movie = Movie.builder()
//                .movieName(addMovieRequest.getMovieName())
//                .movieGenre(addMovieRequest.getMovieGenre())
//                .moviePoster(posterPath)
//                .movieDirector(addMovieRequest.getMovieDirector())
//                .recommend(addMovieRequest.getRecommend())
//                .movieActor(addMovieRequest.getMovieActor())
//                .movieGrade(addMovieRequest.getMovieGrade())
//                .movieRanking(addMovieRequest.getMovieRanking())
//                .attendance(addMovieRequest.getAttendance())
//                .comGrade(addMovieRequest.getComGrade())
//                .movieTime(addMovieRequest.getMovieTime())
//                .release(addMovieRequest.getRelease())
//                .movieState(movieState)
//                .build();
//
//        // Movie 객체 저장
//        Movie savedMovie = movieRepository.save(movie);
//
//        // MovieResponse 변환 및 반환
//        return convertToMovieResponse(savedMovie);
//    }
//

    @Transactional
    public List<MovieResponse> recommendMovies(MovieRecommendationRequest request) {
        System.out.println("Received request: " + request);

        Date releasePreference = request.getRelease();
        System.out.println("Release Preference: " + releasePreference);

        List<MovieResponse> responses = movieRepository.findAll().stream()
                .peek(movie -> System.out.println("Processing movie: " + movie))
                .filter(movie -> filterByGenre(movie, request.getMovieGenre()))
                .filter(movie -> filterByRuntime(movie, request.getMovieTime()))
                .filter(movie -> filterByReleaseType(movie, request.getReleaseType()))
                .filter(movie -> filterByLanguage(movie, request.getLanguage()))
                .map(this::convertToMovieResponse)
                .collect(Collectors.toList());

        System.out.println("Filtered movies: " + responses);
        return responses;
    }

    private boolean filterByGenre(Movie movie, String genre) {
        boolean result = genre == null || genre.trim().equalsIgnoreCase(movie.getMovieGenre().trim());
        System.out.println("Filter by genre: " + genre + " - Result: " + result);
        return result;
    }

    private boolean filterByRuntime(Movie movie, String runtime) {
        if (runtime == null) {
            System.out.println("Runtime is null, passing all movies");
            return true;
        }

        RuntimeRange range = runtimeRangeService.getRangeByDisplayName(runtime);
        boolean result = range != null && range.isWithinRange(movie.getMovieTime());
        System.out.println("Filter by runtime: " + runtime + " - Result: " + result);
        return result;
    }

    private boolean filterByReleaseType(Movie movie, String releaseTypeDisplayName) {
        if (releaseTypeDisplayName == null || releaseTypeDisplayName.trim().isEmpty()) {
            return true;
        }

        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.JANUARY, 1, 0, 0, 0);
        Date cutoffDate = calendar.getTime();
        Date releaseDate = movie.getRelease();

        ReleaseType releaseType;
        try {
            releaseType = ReleaseType.fromUserInput(releaseTypeDisplayName);
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid release type: " + releaseTypeDisplayName);
            return false;
        }

        if (releaseType == null || releaseDate == null) {
            return false;
        }

        boolean result = switch (releaseType) {
            case RECENT_RELEASE -> releaseDate.after(cutoffDate);
            case CLASSIC -> releaseDate.before(cutoffDate);
        };
        System.out.println("Filter by release type: " + releaseTypeDisplayName + " - Result: " + result);
        return result;
    }

    private boolean filterByLanguage(Movie movie, String language) {
        boolean result = language == null || language.trim().equalsIgnoreCase(movie.getLanguage().trim());
        System.out.println("Filter by language: " + language + " - Result: " + result);
        return result;
    }

    private MovieResponse convertToMovieResponse(Movie movie) {
        // imagePath가 클래스의 필드라면 null 체크 추가
        if (imagePath == null) {
            throw new IllegalArgumentException("imagePath cannot be null");
        }

        String cleanedImagePath = imagePath.endsWith("/") ? imagePath : imagePath + "/";
        String moviePosterPath = movie.getMoviePoster() != null ? movie.getMoviePoster().replaceFirst("^/", "") : "";
        String fullImagePath = cleanedImagePath + moviePosterPath;

        // MovieState의 null 체크 추가
        String movieStateDisplayName = movie.getMovieState() != null
                ? movie.getMovieState().getDisplayName()
                : "Unknown"; // 기본값 설정

        return new MovieResponse(
                movie.getId(),
                movie.getMovieName(),
                movie.getMovieGenre(),
                fullImagePath,
                movie.getMovieDirector(),
                movie.getRecommend(),
                movie.getMovieActor(),
                movie.getMovieGrade(),
                movie.getMovieRanking(),
                movie.getAttendance(),
                movie.getComGrade(),
                movie.getMovieTime(),
                movie.getRelease(),
                movieStateDisplayName, // MovieState를 문자열로 변환
                movie.getLanguage()
        );
    }

    public List<Movie> searchMovies(String searchQuery) {
        return jpaQueryFactory
                .selectFrom(QMovie.movie)
                .where(createSearchPredicate(searchQuery))
                .fetch();
    }

    private BooleanExpression createSearchPredicate(String searchQuery) {
        if (searchQuery == null || searchQuery.isEmpty()) {
            return null;
        }
        return QMovie.movie.movieName.containsIgnoreCase(searchQuery)
                .or(QMovie.movie.movieGenre.containsIgnoreCase(searchQuery))
                .or(QMovie.movie.movieDirector.containsIgnoreCase(searchQuery))
                .or(QMovie.movie.movieActor.containsIgnoreCase(searchQuery));
    }
}