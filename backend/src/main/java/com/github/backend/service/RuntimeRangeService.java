package com.github.backend.service;

import java.util.Map;
import java.util.HashMap;

import org.springframework.stereotype.Service;

@Service
public class RuntimeRangeService {

    private final Map<String, RuntimeRange> runtimeRanges = new HashMap<>();

    public RuntimeRangeService() {
        // 런타임 범위 설정
        runtimeRanges.put("100~150", new RuntimeRange(100, 150));
        runtimeRanges.put("150~200", new RuntimeRange(150, 200));
        runtimeRanges.put("200 이상", new RuntimeRange(200, Integer.MAX_VALUE));
    }

    public RuntimeRange getRangeByDisplayName(String displayName) {
        return runtimeRanges.get(displayName);
    }
}
