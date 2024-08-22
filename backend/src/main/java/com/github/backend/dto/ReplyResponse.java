package com.github.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReplyResponse {
    private Integer id;
    private Integer postId;
    private Integer userId;
    private String replyContent;
    private LocalDateTime replyCreate;
    private String nickname;

}
