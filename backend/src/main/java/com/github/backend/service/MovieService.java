package com.github.backend.service;


import com.github.backend.dto.MovieRecommendationRequest;
import com.github.backend.dto.MovieResponse;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MovieService {

    private final JPAQueryFactory jpaQueryFactory;
    private final KobisService kobisService;


    @Transactional
    public List<MovieResponse> recommendMovies(MovieRecommendationRequest request) {
        List<Map<String, Object>> movies = kobisService.getAllMovies();

        return movies.stream()
                .filter(movie -> filterByGenre(movie, request.getMovieGenre()))
                .filter(movie -> filterByReleaseType(movie, request.getReleaseType()))
                .filter(movie -> filterByLanguage(movie, request.getLanguage()))
                .map(this::convertToMovieResponse)
                .collect(Collectors.toList());
    }

    private boolean filterByGenre(Map<String, Object> movie, String genre) {
        String movieGenre = (String) movie.get("genreAlt");
        return genre == null || genre.trim().equalsIgnoreCase(movieGenre.trim());
    }

    private boolean filterByReleaseType(Map<String, Object> movie, String releaseTypeDisplayName) {
        if (releaseTypeDisplayName == null || releaseTypeDisplayName.trim().isEmpty()) {
            return true;
        }

        String releaseDateStr = (String) movie.get("openDt");
        LocalDate releaseDate;
        try {
            releaseDate = LocalDate.parse(releaseDateStr, DateTimeFormatter.BASIC_ISO_DATE);
        } catch (Exception e) {
            return false; // 날짜 형식이 잘못된 경우 필터링에서 제외
        }

        LocalDate cutoffDate = LocalDate.now().minusYears(1);

        // fromDisplayName 메서드를 사용하여 ReleaseType 찾기
        Optional<ReleaseType> releaseTypeOptional = ReleaseType.fromDisplayName(releaseTypeDisplayName);
        if (!releaseTypeOptional.isPresent()) {
            return false;
        }

        ReleaseType releaseType = releaseTypeOptional.get();

        return switch (releaseType) {
            case RECENT_RELEASE -> releaseDate.isAfter(cutoffDate);
            case CLASSIC -> releaseDate.isBefore(cutoffDate);
        };
    }

    private boolean filterByLanguage(Map<String, Object> movie, String language) {
        String movieLanguage = (String) movie.get("repNationNm");
        return language == null || language.trim().equalsIgnoreCase(movieLanguage.trim());
    }

    private MovieResponse convertToMovieResponse(Map<String, Object> movie) {
        // Map에서 각 필드를 추출
        String id = (String) movie.get("movieCd");
        String movieName = (String) movie.get("movieNm");
        String genre = (String) movie.get("genreAlt");
        String director = (String) movie.get("director");
        String productionYear = (String) movie.get("prdtYear");
        String actor = (String) movie.get("actor");
        String audit = (String) movie.get("audits");
        String rank = (String) movie.get("rank");
        Integer sales = (Integer) movie.get("sales");
        String classGrade = (String) movie.get("classGrade");
        Integer runtime;
        try {
            runtime = Integer.valueOf((String) movie.get("runtime"));
        } catch (NumberFormatException e) {
            runtime = null; // 런타임 형식이 잘못된 경우 null 설정
        }

        // openDt는 LocalDate로 변환
        LocalDate releaseDate;
        try {
            releaseDate = LocalDate.parse((String) movie.get("openDt"), DateTimeFormatter.BASIC_ISO_DATE);
        } catch (Exception e) {
            releaseDate = null; // 날짜 형식이 잘못된 경우 null 설정
        }

        String country = (String) movie.get("repNationNm");

        return MovieResponse.builder()
                .id(id)
                .movieName(movieName)
                .genre(genre)
                .director(director)
                .productionYear(productionYear)
                .actor(actor)
                .audit(audit)
                .rank(rank)
                .sales(sales)
                .classGrade(classGrade)
                .runtime(runtime)
                .releaseDate(releaseDate)
                .country(country)
                .build();
    }
}

