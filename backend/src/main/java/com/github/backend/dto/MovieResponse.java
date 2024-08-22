package com.github.backend.dto;

import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MovieResponse {
    private Integer id;
    private String movieName;
    private String movieGenre;
    private String moviePoster;
    private String movieDirector;
    private Integer recommend;
    private String movieActor;
    private String movieGrade;
    private Integer movieRanking;
    private Integer attendance;
    private String comGrade;
    private Integer movieTime;
    private Date release;
    private String movieState;
    private String language;
}
