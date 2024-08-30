package com.github.backend.service;

import com.github.backend.dto.BoxOfficeResult;
import com.github.backend.dto.DailyBoxOffice;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

            Map<String, Object> movieListResult = (Map<String, Object>) response.get("movieListResult");
            if (movieListResult != null) {
                return (List<Map<String, Object>>) movieListResult.get("movieList");
            }
            return List.of();
        } catch (Exception e) {
            throw new RuntimeException("영화 목록 정보를 가져오는 데 실패했습니다.", e);
        }
    }



}