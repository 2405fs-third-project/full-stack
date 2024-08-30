package com.github.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BoxOfficeResult {
    private String boxofficeType;
    private String showRange;
    private List<DailyBoxOffice> dailyBoxOfficeList;
}