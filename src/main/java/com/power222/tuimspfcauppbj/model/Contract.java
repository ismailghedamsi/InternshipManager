package com.power222.tuimspfcauppbj.model;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode // je sais pas si j'en est besoin
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

    @OneToOne
    private StudentApplication studentApplication;

}
