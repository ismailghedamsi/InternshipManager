package com.power222.tuimspfcauppbj.util;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Opinion {

    @JsonProperty("Totalement en accord")
    TOTALY_AGGREED,
    @JsonProperty("Plutôt en accord")
    AGGREED,
    @JsonProperty("Plutôt en désaccord")
    DISAGREED,
    @JsonProperty("Totalement en désaccord")
    TOTALY_DISAGREED,
    @JsonProperty("N/A")
    N_A
}
