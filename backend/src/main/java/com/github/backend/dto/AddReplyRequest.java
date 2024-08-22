package com.github.backend.dto;

import lombok.Data;

@Data
public class AddReplyRequest {

    private Integer postId;
    private Integer userId;
    private String replyContent;
    private String nickname;
}
