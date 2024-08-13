package com.github.backend.controller;

import com.github.post.dto.MovieResponse;
import com.github.post.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    @GetMapping("/{id}")
    public MovieResponse getMovieById(@PathVariable Integer id) {
        return movieService.getMovieById(id);
    }
}
