package com.github.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class PostResponse {

    private Integer userId;
    private Integer postNumber;
    private String postName;
    private String postContent;
    private Integer views;
    private Integer likes;
    private LocalDateTime postCreate;

}
