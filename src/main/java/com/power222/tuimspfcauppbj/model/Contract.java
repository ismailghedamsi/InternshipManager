package com.power222.tuimspfcauppbj.model;

import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import lombok.*;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Contract extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Lob
    private String file;

    private String engagementCollege;
    private String engagementCompany;
    private String engagementStudent;
    private String adminName;
    private int totalHoursPerWeek;

    @Builder.Default
    private ContractSignatureState signatureState = ContractSignatureState.PENDING_FOR_ADMIN_REVIEW;

    @OneToOne
    private StudentApplication studentApplication;
}
