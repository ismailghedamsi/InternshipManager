package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

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
    private String joinedFile;

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

    public enum ReviewState {
        PENDING, APPROVED, DENIED
    }
}
