package com.github.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@AllArgsConstructor
@Data
public class AddMovieRequest {
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
}