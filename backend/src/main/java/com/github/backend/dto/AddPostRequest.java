package com.github.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class AddPostRequest {
    private Integer boardId; // 게시판 ID
    private Integer userId;
    private Integer postNumber;
    private String postName;
    private String postContent;
    private Integer views;
    private Integer likes;
    private LocalDateTime postCreate;
    private String type;
    private Integer point;
}
