package com.github.backend.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.util.Arrays;
import java.util.Optional;

@Getter
public enum ReleaseType {
    RECENT_RELEASE("최근 개봉 영화"),
    CLASSIC("클래식 영화");

    private final String displayName;

    ReleaseType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Optional<ReleaseType> fromDisplayName(String displayName) {
        return Arrays.stream(values())
                .filter(type -> type.displayName.equalsIgnoreCase(displayName))
                .findFirst();
    }

    public static ReleaseType fromUserInput(String userInput) {
        switch (userInput.toUpperCase()) {
            case "RECENT_RELEASE":
                return RECENT_RELEASE;
            case "CLASSIC":
                return CLASSIC;
            default:
                throw new IllegalArgumentException("Unknown release type: " + userInput);
        }
    }
}