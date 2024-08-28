package com.github.backend.service;

public class RuntimeRange {
    private final int minTime;
    private final int maxTime;

    public RuntimeRange(int minTime, int maxTime) {
        this.minTime = minTime;
        this.maxTime = maxTime;
    }

    public int getMinTime() {
        return minTime;
    }

    public int getMaxTime() {
        return maxTime;
    }

    public boolean isWithinRange(int time) {
        return time >= minTime && time <= maxTime;
    }
}
