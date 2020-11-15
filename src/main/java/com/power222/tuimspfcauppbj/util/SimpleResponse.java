package com.power222.tuimspfcauppbj.util;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SimpleResponse {
    @JsonProperty("Oui")
    YES,
    @JsonProperty("Non")
    NO,
    @JsonProperty("Peut-être")
    MAYBE
}
