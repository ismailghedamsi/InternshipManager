package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode
public class StudentApplication {

    @Id
    private long id;

    @ManyToOne
    @JsonIgnoreProperties({"joinedFile", "allowedStudents", "applications"})
    private InternshipOffer offer;

    @ManyToOne
    @JsonIgnoreProperties({"resumes", "allowedOffers", "applications"})
    private Student student;

    @ManyToOne
    @JsonIgnoreProperties("owner")
    private Resume resume;
}
