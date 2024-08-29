package com.github.backend.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MovieResponse {
    private String id;
    private String movieName;
    private String genre;
    private String director;
    private String productionYear;
    private String actor;
    private String audit;
    private String rank;
    private Integer sales;
    private String classGrade;
    private Integer runtime;
    private LocalDate releaseDate;
    private String country;

}
