package com.github.backend.service;

import lombok.Getter;

@Getter
public enum MessageService {
    USER_NOT_FOUND("아이디가 존재하지 않습니다."),
    INVALID_PASSWORD("비밀번호가 일치하지 않습니다."),
    SUCCEED_CREATE_ACCOUNT("환영합니다, 회원가입에 성공하였습니다."),
    EXISTING_USERID("ERROR: 이미 존재하는 ID입니다, 다른 ID로 변경해주세요."),
    EXISTING_NICKNAME("ERROR: 이미 존재하는 닉네임 입니다, 다른 닉네임으로 변경해주세요."),
    SUCCEED_LOGIN("어서오세요, 로그인에 성공하였습니다."),
    EXPIRED_ACCESS_TOKEN("토큰이 만료되었습니다. 다시 로그인 해주세요");


    private String message;

    MessageService(String message) {
        this.message = message;
    }
}
