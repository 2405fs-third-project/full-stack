package com.github.backend.service;

import com.github.backend.dto.AddMovieRequest;
import com.github.backend.dto.MovieRecommendationRequest;
import com.github.backend.dto.MovieResponse;
import com.github.backend.model.Movie;
import com.github.backend.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Locale.filter;

@RequiredArgsConstructor
@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Value("${image.upload.path}")
    private String imagePath;

    @Transactional(readOnly = true) //이미지 불러오기
    public MovieResponse getMovieById(Integer id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        if(!"상영중".equals(movie.getMovieState())){
            throw new IllegalArgumentException("Movie state error");
        }

        String cleanedImagePath = StringUtils.trimTrailingCharacter(imagePath, '/');
        String moviePosterPath = StringUtils.trimLeadingCharacter(movie.getMoviePoster(), '/');
        String fullImagePath = cleanedImagePath + "/" + moviePosterPath;

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
                movie.getMovieState(),
                movie.getLanguage()
        );
    }

    @Transactional // 영화 포스터 등록
    public Movie createMovie(AddMovieRequest addMovieRequest) {
        // 이미지 저장
        String posterPath = saveImage(addMovieRequest.getMoviePoster());

        // Movie 엔티티 생성
        Movie movie = new Movie();
        movie.setMovieName(addMovieRequest.getMovieName());
        movie.setMovieGenre(addMovieRequest.getMovieGenre());
        movie.setMoviePoster(posterPath);
        movie.setMovieDirector(addMovieRequest.getMovieDirector());
        movie.setRecommend(addMovieRequest.getRecommend());
        movie.setMovieActor(addMovieRequest.getMovieActor());
        movie.setMovieGrade(addMovieRequest.getMovieGrade());
        movie.setMovieRanking(addMovieRequest.getMovieRanking());
        movie.setAttendance(addMovieRequest.getAttendance());
        movie.setComGrade(addMovieRequest.getComGrade());
        movie.setMovieTime(addMovieRequest.getMovieTime());
        movie.setRelease(addMovieRequest.getRelease());
        movie.setMovieState(addMovieRequest.getMovieState());

        return movieRepository.save(movie);
    }

    private String saveImage(String imageName) {
        if (StringUtils.isEmpty(imageName)) {
            return null;
        }

        // 이미지 파일 저장 경로 설정 (resources/static/img)
        File imageFile = new File(imagePath + File.separator + imageName);

        // 이미지 파일이 존재하지 않으면 오류 처리
        if (!imageFile.exists()) {
            throw new RuntimeException("Image file not found: " + imageName);
        }

        try {
            // 이미지 파일을 src/main/resources/static/img 디렉토리로 복사
            File destinationFile=new File("src/main/resources/static/img/" + imageName);
            Files.copy(imageFile.toPath(), destinationFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            return"/img/" + imageName;  // 웹에서 접근할 경로
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image file: " + imageName, e);
        }
    }

    @Transactional //영화 추천 기능
    public List<MovieResponse> recommendMovies(MovieRecommendationRequest request) {
        Date releasePreference = request.getRelease();

        return movieRepository.findAll().stream()
                .filter(movie -> filterByGenre(movie, request.getMovieGenre()))
                .filter(movie -> filterByRuntime(movie, request.getMovieTime()))
                .filter(movie -> filterByReleaseType(movie, request.getReleaseType(), releasePreference))
                .filter(movie -> filterByLanguage(movie, request.getLanguage()))
                .map(this::convertToMovieResponse)
                .collect(Collectors.toList());
    }

    private boolean filterByReleaseType(Movie movie, String releaseType, Date releasePreference) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.JANUARY, 1, 0, 0, 0);
        Date cutoffDate = calendar.getTime();

        Date releaseDate = movie.getRelease();

        if (releaseType == null || releaseDate == null) {
            return true;
        }

        if ("최근 개봉 영화".equalsIgnoreCase(releaseType)) {
            return releaseDate.after(cutoffDate);
        } else if ("클래식 영화".equalsIgnoreCase(releaseType)) {
            return releaseDate.before(cutoffDate);
        }
        return false;
    }

    private boolean filterByGenre(Movie movie, String genre) {
        return genre == null || genre.equalsIgnoreCase(movie.getMovieGenre());
    }

    private boolean filterByRuntime(Movie movie, String runtime) {
        if (runtime == null) return true;
        int movieTime = movie.getMovieTime();
        switch (runtime) {
            case "100~150분":
                return movieTime >= 100 && movieTime <= 150;
            case "150~200분":
                return movieTime > 150 && movieTime <= 200;
            case "200분 이상":
                return movieTime > 200;
            default:
                return false;
        }
    }

    private boolean filterByLanguage(Movie movie, String language) {
        String movieState = movie.getMovieState();
        return language == null || (movieState != null && language.equalsIgnoreCase(movieState.trim()));
    }

    private MovieResponse convertToMovieResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .movieName(movie.getMovieName())
                .movieGenre(movie.getMovieGenre())
                .moviePoster("/img/" + movie.getMoviePoster())  // 이미지 경로 설정
                .movieDirector(movie.getMovieDirector())
                .recommend(movie.getRecommend())
                .movieActor(movie.getMovieActor())
                .movieGrade(movie.getMovieGrade())
                .movieRanking(movie.getMovieRanking())
                .attendance(movie.getAttendance())
                .comGrade(movie.getComGrade())
                .movieTime(movie.getMovieTime())
                .release(movie.getRelease())
                .movieState(movie.getMovieState())
                .language(movie.getLanguage())
                .build();
    }

}
