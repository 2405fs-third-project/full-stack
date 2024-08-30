package com.github.backend.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class KobisService {

    @Value("${kobis.api.key}")
    private String apiKey;

    @Value("${kobis.api.url}")
    private String apiUrl;

    @Value("${kobis.api.movieListUrl}")
    private String movieListUrl;
    private String movieDBResult = "movieListResult";
    private String movieDBList = "movieList";
    private final RestTemplate restTemplate;

    public KobisService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> getCurrentMovies(LocalDate date) {
        // 하루 전 날짜 계산
        LocalDate targetDate = date.minusDays(1);
        String formattedDate = targetDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String url = String.format("%s?key=%s&targetDt=%s", apiUrl, apiKey, formattedDate);

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            // 응답 데이터 검토
            if (response == null) {
                throw new RuntimeException("API 응답이 null입니다.");
            }
            System.out.println("API 응답: " + response);

            Map<String, Object> boxOfficeResult = (Map<String, Object>) response.get("boxOfficeResult");
            if (boxOfficeResult != null) {
                System.out.println("BoxOfficeResult: " + boxOfficeResult);
                // 로그로 응답 데이터 출력
                System.out.println("DailyBoxOfficeList: " + boxOfficeResult.get("dailyBoxOfficeList"));
            }

            return response;
        } catch (Exception e) {
            System.err.println("데이터를 가져오는 중 오류 발생: " + e.getMessage());
            throw new RuntimeException("현재 영화 정보를 가져오는 데 실패했습니다.", e);
        }
    }

    public List<Map<String, Object>> getAllMovies() {
        String url = String.format("%s?key=%s", movieListUrl, apiKey);

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null) {
                throw new RuntimeException("API 응답이 null입니다.");
            }

            Map<String, Object> movieListResult = (Map<String, Object>) response.get(movieDBResult);
            if (movieListResult != null) {
                return (List<Map<String, Object>>) movieListResult.get(movieDBList);
            }
            return List.of();
        } catch (Exception e) {
            throw new RuntimeException("영화 목록 정보를 가져오는 데 실패했습니다.", e);
        }
    }

    public List<Map<String, Object>> searchMovies(String searchQuery) {
        String movieNmurl = String.format("%s?key=%s&movieNm=%s", movieListUrl, apiKey, searchQuery);
        String directorNmurl = String.format("%s?key=%s&directorNm=%s", movieListUrl, apiKey, searchQuery);
        try {
            Map<String, Object> movieNmResponse = restTemplate.getForObject(movieNmurl, Map.class);
            Map<String, Object> directorNmResponse = restTemplate.getForObject(directorNmurl, Map.class);

            Map<String, Object> combinedResponse = new HashMap<>();

            if (movieNmResponse != null) {
                combinedResponse.putAll(movieNmResponse);
            }

            if (directorNmResponse != null) {
                combinedResponse.putAll(directorNmResponse);
            }

        if (combinedResponse == null || combinedResponse.isEmpty()) {
            throw new RuntimeException(MessageService.API_RESPONCE_FAILED.getMessage());
        }

        Map<String, Object> movieListResult = (Map<String, Object>) combinedResponse.get(movieDBResult);
            if (movieListResult != null) {
                Object movieDBListObject = movieListResult.get(movieDBList);
                if (movieDBListObject instanceof List) {
                    List<?> list = (List<?>) movieDBListObject;
                    if (list.isEmpty()) {
                        return List.of(Map.of("ERROR", MessageService.CANNOT_FIND_MOVIE.getMessage())); // 빈 리스트
                    }
                    return (List<Map<String, Object>>) list;
                }
            }
        return List.of(Map.of("ERROR",MessageService.CANNOT_FIND_MOVIE.getMessage()));
        }catch(Exception e)
        {
        throw new RuntimeException(MessageService.GET_MOVIE_LIST_FAILED.getMessage(), e);
        }
    }



}