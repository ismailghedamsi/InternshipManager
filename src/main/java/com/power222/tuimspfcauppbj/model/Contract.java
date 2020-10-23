package com.power222.tuimspfcauppbj.model;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // @Lob
    //private String file;

    private String engagementCollege;
    private String engagementCompany;
    private String engagementStudent;
    private String adminName;
    private int horaire;

    @OneToOne
    private StudentApplication studentApplication;

}
