package com.power222.tuimspfcauppbj.model;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true) // fonctione pas
public class InternEvaluation extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    //1
    private String studentName;
    private String studentStudy;
    private String nameEntreprise;
    private String nameSuperViseur;
    private String fonction;
    private String phoneNumber;

    //2


    @OneToOne()
    private Contract contract;
}
