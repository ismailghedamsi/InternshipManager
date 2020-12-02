package com.power222.tuimspfcauppbj.util;

import lombok.Builder;
import lombok.Data;

import javax.persistence.Lob;
import java.time.ZonedDateTime;

@Data
@Builder
public class ContractSignatureDTO {
    private long contractId;
    private boolean isApproved;
    private String reasonForRejection;

    @Lob
    private String imageSignature;
    private String nomSignataire;
    private ZonedDateTime signatureTimestamp;
}
