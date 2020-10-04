package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Date;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode
public class InternshipOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;
    private String description;
    private int nbOfWeeks;
    private double salary;
    private int beginHour;
    private int endHour;
    private Date creationDate;
    private Date limitDateToApply;

    @Lob
    private String joinedFile;

    @ManyToOne(optional = false)
    @JsonIgnoreProperties("offers")
    private Employer employer;

    @ManyToMany
    @JsonIgnoreProperties({"appliedOffers", "resumes"})
    private List<Student> allowedStudents;
}
