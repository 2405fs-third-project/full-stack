package com.github.backend.service;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.github.backend.dto.BoxOfficeResult;
import com.github.backend.dto.DailyBoxOffice;

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

    // 현재 박스오피스 영화 목록 가져오기
    public BoxOfficeResult getCurrentMovies(LocalDate date) {
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

            Map<String, Object> boxOfficeResultMap = (Map<String, Object>) response.get("boxOfficeResult");
            if (boxOfficeResultMap == null) {
                throw new RuntimeException("BoxOfficeResult 데이터를 찾을 수 없습니다.");
            }

            BoxOfficeResult boxOfficeResult = new BoxOfficeResult();
            boxOfficeResult.setBoxofficeType((String) boxOfficeResultMap.get("boxofficeType"));
            boxOfficeResult.setShowRange((String) boxOfficeResultMap.get("showRange"));

            List<Map<String, Object>> dailyBoxOfficeListMap = (List<Map<String, Object>>) boxOfficeResultMap.get("dailyBoxOfficeList");
            List<DailyBoxOffice> dailyBoxOfficeList = dailyBoxOfficeListMap.stream()
                    .map(this::convertToDailyBoxOffice)
                    .toList();

            boxOfficeResult.setDailyBoxOfficeList(dailyBoxOfficeList);

            return boxOfficeResult;
        } catch (Exception e) {
            System.err.println("데이터를 가져오는 중 오류 발생: " + e.getMessage());
            throw new RuntimeException("현재 영화 정보를 가져오는 데 실패했습니다.", e);
        }
    }

    private DailyBoxOffice convertToDailyBoxOffice(Map<String, Object> map) {
        DailyBoxOffice dailyBoxOffice = new DailyBoxOffice();
        dailyBoxOffice.setRank((String) map.get("rank"));
        dailyBoxOffice.setMovieNm((String) map.get("movieNm"));
        dailyBoxOffice.setOpenDt((String) map.get("openDt"));
        dailyBoxOffice.setAudiCnt((String) map.get("audiCnt"));
        dailyBoxOffice.setAudiAcc((String) map.get("audiAcc"));
        return dailyBoxOffice;
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