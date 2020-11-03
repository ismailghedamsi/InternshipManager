package com.power222.tuimspfcauppbj.model;

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

    @Lob
    private String engagementCollege;

    @Lob
    private String engagementCompany;

    @Lob
    private String engagementStudent;

    private String adminName;
    private float totalHoursPerWeek;

    @OneToOne
    private StudentApplication studentApplication;

}
