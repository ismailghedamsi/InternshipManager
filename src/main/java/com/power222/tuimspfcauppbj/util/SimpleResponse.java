package com.power222.tuimspfcauppbj.util;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SimpleResponse {
    @JsonProperty("yes")
    YES,
    @JsonProperty("no")
    NO,
    @JsonProperty("maybe")
    MAYBE
}
