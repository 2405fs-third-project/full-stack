package com.github.backend.service;

import com.github.post.dto.MovieResponse;
import com.github.post.model.Movie;
import com.github.post.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
}
