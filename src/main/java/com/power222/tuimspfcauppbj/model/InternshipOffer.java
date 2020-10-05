package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

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

    @SuppressWarnings("JpaDataSourceORMInspection")
    @ManyToMany
    @JoinTable(name = "OFFER_ALLOWED_STUDENT")
    @JsonIgnoreProperties({"appliedOffers", "resumes", "allowedOffers"})
    private List<Student> allowedStudents;

    @ManyToMany(mappedBy = "appliedOffers")
    @JsonIgnoreProperties({"appliedOffers", "resumes", "allowedOffers"})
    private List<Student> appliedStudents;
}
