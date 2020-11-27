package com.power222.tuimspfcauppbj.util;

public enum ReviewState {
    PENDING("en attente"), APPROVED("approuvé"), DENIED("refusé");

    private final String value;

    ReviewState(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
