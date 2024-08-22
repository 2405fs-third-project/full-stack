package com.github.backend.controller;

import com.github.backend.dto.AddMovieRequest;
import com.github.backend.dto.MovieResponse;
import com.github.backend.model.Movie;
import com.github.backend.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    @GetMapping("/{id}")
    public MovieResponse getMovieById(@PathVariable Integer id) {
        return movieService.getMovieById(id);
    }

    @PostMapping
    public ResponseEntity<MovieResponse> createMovie(@Valid @RequestBody AddMovieRequest addMovieRequest) {
        // 영화 등록 요청 처리
        Movie movie = movieService.createMovie(addMovieRequest);

        // 등록된 영화 정보를 반환
        MovieResponse movieResponse = movieService.getMovieById(movie.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(movieResponse);
    }


}
