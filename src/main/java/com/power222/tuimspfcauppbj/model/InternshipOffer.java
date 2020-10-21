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
    private double salary;
    private Date creationDate;
    private Date limitDateToApply;
    private Date internshipStartDate;
    private Date internshipEndDate;
    private int nbStudentToHire;
    private ReviewState reviewState;
    private String reasonForRejection;

    @Lob
    private String file;

    @ManyToOne(optional = false)
    @JsonIgnoreProperties("offers")
    private Employer employer;

    @SuppressWarnings("JpaDataSourceORMInspection")
    @ManyToMany
    @JoinTable(name = "OFFER_ALLOWED_STUDENT")
    @JsonIgnoreProperties({"applications", "resumes", "allowedOffers"})
    private List<Student> allowedStudents;

    @OneToMany(mappedBy = "offer", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"offer"})
    private List<StudentApplication> applications;
}
