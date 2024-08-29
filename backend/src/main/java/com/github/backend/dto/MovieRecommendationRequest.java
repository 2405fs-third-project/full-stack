package com.github.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class MovieRecommendationRequest {
    private String movieGenre;
    private String movieTime;
    private String releaseType;
    private String language;
    private LocalDate release;
}
