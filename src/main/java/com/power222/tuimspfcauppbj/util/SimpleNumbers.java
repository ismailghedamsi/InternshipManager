package com.power222.tuimspfcauppbj.util;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SimpleNumbers {
    @JsonProperty("Un stagiaire")
    ONE,
    @JsonProperty("Deux stagiaires")
    TWO,
    @JsonProperty("Trois stagiaires")
    THREE,
    @JsonProperty("Plus de trois")
    MORE
}
