package com.github.backend.service;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum MovieState {
    상영중("상영중"),
    종료됨("종료됨"),
    예정("예정");

    private final String displayName;

    MovieState(String displayName) {
        this.displayName = displayName;
    }

    public static MovieState fromDisplayName(String displayName) {
        return Arrays.stream(values())
                .filter(state -> state.getDisplayName().equals(displayName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown display name: " + displayName));
    }
}