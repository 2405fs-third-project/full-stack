package com.github.backend.controller;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.github.backend.service.KobisService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.backend.dto.MovieRecommendationRequest;
import com.github.backend.dto.MovieResponse;
import com.github.backend.model.Movie;
import com.github.backend.service.MovieService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;
    private final KobisService kobisService;

    @GetMapping("/current")
    public Map<String, Object> getCurrentMovies() {
        LocalDate today = LocalDate.now();
        return kobisService.getCurrentMovies(today);
    }


    @PostMapping("/recommend") // 영화 추천
    public ResponseEntity<List<MovieResponse>> recommendMovies(@Valid @RequestBody MovieRecommendationRequest request) {
        List<MovieResponse> recommendedMovies = movieService.recommendMovies(request);
        return ResponseEntity.ok(recommendedMovies);
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchMovies(@RequestParam String searchQuery) {
        String decodedQuery = URLDecoder.decode(searchQuery, StandardCharsets.UTF_8);
        return kobisService.searchMovies(decodedQuery);
    }



}
