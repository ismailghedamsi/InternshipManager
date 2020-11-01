package com.power222.tuimspfcauppbj.util;

import lombok.Builder;
import lombok.Data;
import org.joda.time.LocalDateTime;

import javax.persistence.Lob;

@Data
@Builder
public class ContractSignatureDTO {
    private boolean isApproved;
    private String reasonForRejection;

    @Lob
    private String imageSignature;
    private String nomSignataire;
    private LocalDateTime signatureTimestamp;
}
