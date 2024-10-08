package com.github.backend.model;

import com.github.backend.service.MovieState;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "movie")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "movie_name", nullable = false, length = 100)
    private String movieName;

    @Column(name = "movie_genre", nullable = false, length = 50)
    private String movieGenre;

    @Column(name = "movie_poster", nullable = false, length = 500)
    private String moviePoster;

    @Column(name = "movie_director", nullable = false, length = 50)
    private String movieDirector;

    @Column(name = "recommend")
    private Integer recommend;

    @Column(name = "movie_actor", nullable = false, length = 100)
    private String movieActor;

    @Column(name = "movie_grade", nullable = false, length = 50)
    private String movieGrade;

    @Column(name = "movie_ranking")
    private Integer movieRanking;

    @Column(name = "attendance")
    private Integer attendance;

    @Column(name = "com_grade", length = 50)
    private String comGrade;

    @Column(name = "movie_time", nullable = false)
    private Integer movieTime;

    @Column(name = "release")
    private Date release;

    @Enumerated(EnumType.STRING)
    @Column(name = "movie_state", length = 50)
    private MovieState movieState;

    @Column(name = "language", length = 50)
    private String language;
}


