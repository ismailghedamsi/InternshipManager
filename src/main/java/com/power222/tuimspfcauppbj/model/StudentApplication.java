package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode
public class StudentApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private boolean hired;
    private String reasonForRejection;
    private ReviewState reviewState;

    @ManyToOne
    @JsonIgnoreProperties({"file", "allowedStudents", "applications"})
    private InternshipOffer offer;

    @ManyToOne
    @JsonIgnoreProperties({"resumes", "allowedOffers", "applications"})
    private Student student;

    @ManyToOne
    @JsonIgnoreProperties({"owner", "applications"})
    private Resume resume;

    //@OneToOne
    //private Contract contract;
}
