package com.power222.tuimspfcauppbj.util;

import lombok.Builder;
import lombok.Data;

import javax.persistence.Lob;
import java.time.LocalDateTime;

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
