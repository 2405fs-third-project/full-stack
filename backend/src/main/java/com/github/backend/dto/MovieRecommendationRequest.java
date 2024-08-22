package com.github.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MovieRecommendationRequest {
    private String movieGenre;
    private String movieTime;
    private Date release;
    private String language;
    private String releaseType;
}
