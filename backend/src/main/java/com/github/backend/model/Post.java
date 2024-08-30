package com.github.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "post_number", nullable = false)
    private Integer postNumber;

    @Column(name = "post_name", nullable = false, length = 50, unique = true)
    private String postName;

    @Column(name = "post_content", nullable = false, length = 1000)
    private String postContent;

    @Column(name = "views")
    private Integer views = 0; // 기본값 설정

    @Column(name = "likes")
    private Integer likes = 0; // 기본값 설정

    @Column(name = "post_create", nullable = false)
    private LocalDateTime postCreate = LocalDateTime.now();

    @Column(name = "type")
    private String type;

    @Version
    @Column(name = "version")
    private Long version = 0L;

}
