package com.github.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class KobisService {

    @Value("${kobis.api.key}")
    private String apiKey;

    @Value("${kobis.api.url}")
    private String apiUrl;

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
}
