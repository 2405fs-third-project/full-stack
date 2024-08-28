package com.github.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MovieRecommendationRequest {
    private String movieGenre;
    private String movieTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date release;  // Date 타입 유지
    private String language;
    private String releaseType;
}
