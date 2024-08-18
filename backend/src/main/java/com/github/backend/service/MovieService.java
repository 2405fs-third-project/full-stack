package com.github.backend.service;

import com.github.backend.dto.AddMovieRequest;
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
                movie.getMovieState()
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
            // 이미지 파일을 resources/static/img 디렉토리로 복사
            File destinationFile = new File("src/main/resources/static/img" + File.separator + imageName);
            Files.copy(imageFile.toPath(), destinationFile.toPath());
            return imageName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image file: " + imageName, e);
        }
    }

}
