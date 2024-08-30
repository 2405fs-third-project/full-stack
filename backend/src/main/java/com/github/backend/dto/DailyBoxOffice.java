package com.github.backend.dto;

import lombok.Data;

@Data
public class DailyBoxOffice {
    private String rank;
    private String movieNm;
    private String openDt;
    private String audiCnt;
    private String audiAcc;
    // 필요한 필드를 추가로 정의
}